import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import styles from './ShowData.module.scss';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { createClient } from "contentful";
const ShowData = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [cryptoArray, setCryptoArray] = useState([]);
  const [faqArray, setFaqArray] = useState([]);
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const client = createClient({ 
    space: "4fvznm2u5cg7", 
    accessToken: "yy1xv31CKjpp1pbpgxGitvx7a9JhNtb-AhH9Q1sQ-vk" 
  })

  useEffect(() => {
    const getAllEntries = async () => {
      try {
        setLoading(true);
        await client.getEntries().then((entries) => {
          setData(entries);
        });
      } catch (error) {
        console.log(`Error fetching authors ${error}`);
      }
      finally{
        setLoading(false);
      }
    };
    getAllEntries();
  }, []);
  
  useEffect(() => {
    const filterData = () => {
      const filteredItems = data?.items?.find((item) => item?.fields?.slug === id);
      setFilteredData(filteredItems);
    };

    filterData();
  }, [data, id]);


  useEffect(() => {
    const updateArrays = () => {
      const newCryptoArray = [];
      const newFaqArray = [];

      for (const key in filteredData?.fields) {
        if (key.startsWith("cryptoQuestion")) {
          const questionKey = key;
          const answerKey = key.replace("cryptoQuestion", "cryptoAnswer");
          const question = filteredData?.fields[questionKey];
          const answer = documentToHtmlString(filteredData?.fields[answerKey]);
          newCryptoArray.push({ question, answer });
        } else if (key.startsWith("faqQuestion")) {
          const questionKey = key;
          const answerKey = key.replace("faqQuestion", "faqAnswer");
          const question = filteredData?.fields[questionKey];
          const answer = documentToHtmlString(filteredData?.fields[answerKey]);
          newFaqArray.push({ question, answer });
        }
      }

      setCryptoArray(newCryptoArray);
      setFaqArray(newFaqArray);
    };

    updateArrays();
  }, [filteredData]);

  function convertHtmlToText(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  }

  function convertHtmlToTextWithBreaks(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const elements = Array.from(doc.body.childNodes);

    const renderElements = elements.map((element, index) => {
      if (element.nodeName === 'P') {
        return <p key={index} style={{ margin: '10px 0' }}>{element.textContent}</p>;
      } else if (element.nodeName === 'UL') {
        const listItems = Array.from(element.querySelectorAll('li'));
        return (
          <ul key={index} style={{ listStyleType: 'disc', margin: '0 auto' }}>
            {listItems.map((listItem, listIndex) => (
              <li key={listIndex}>{listItem.textContent}</li>
            ))}
          </ul>
        );
      }
      return null;
    });

    return renderElements;
  }

  return (
    <div>
      {loading && 
      <div style={{width: "100vw", height:"100vh", display:"flex", justifyContent:"center", alignItems:"center"}}>Loading...</div>
      }
      {
        filteredData?.fields &&
        <div className={styles.homePageWrapper}>
          <div className={styles.heroSection}>
            <div className={styles.heroImageWrapper}>
              <img src={`${filteredData?.fields?.heroSectionImage1?.fields?.file?.url}`} alt='Frame1.png' />
              <img src={`${filteredData?.fields?.heroSectionImage2?.fields?.file?.url}`} alt='Frame2.png' />
              <img src={`${filteredData?.fields?.heroSectionImage3?.fields?.file?.url}`} alt='Frame3.png' />
            </div>
            <div className={styles.heroSectionWrapper}>
              <h3>{filteredData?.fields?.heroSectionTitle}</h3>
              <p>{filteredData?.fields?.heroSectionTitleDiscription}</p>
            </div>
          </div>

          <section className={styles.qnaCryptoWrapper}>
            <div className={styles.qnaCryptoTitle}>
              <h3>{filteredData?.fields?.section2Title}</h3>
            </div>
            <div className={styles.qnaCryptoBody}>
              <div className={styles?.cardDesignWrap}>
                {
                  cryptoArray?.map((item, index) => (
                    <div key={index} className={styles.cardStyle}>
                      <h4>{item?.question}</h4>
                      <p>{convertHtmlToText(item?.answer)}</p>
                    </div>
                  ))
                }
              </div>
              <div className={styles.qnaSectionImageWrap}>
                <img src='./images/qnaCryptoSectionImg.png' alt='qnaSectionImageWrap' />
              </div>
            </div>
          </section>

          <section className={styles.buyCryptoWrapper}>
            <div className={styles.buyCryptoTitle}>
              <h3>Why use Best Wallet to buy Ethereum?</h3>
            </div>
            <div className={styles.buyCryptoBody}>
              <div className={styles.buySectionImageWrap}>
                <img src='./images/buyCryptoSectionImg.png' alt='qnaSectionImageWrap' />
              </div>
              <div className={styles?.cardDesignWrap}>
                {
                  faqArray?.map((item, index) => (
                    <div key={index} className={styles.cardStyle}>
                      <h4>{item?.question}</h4>
                      <p>{convertHtmlToText(item?.answer)}</p>
                    </div>
                  ))
                }
              </div>
            </div>
          </section>

          <section className={styles.faqWrapper}>
            <div className={styles.faqTitle}>
              <h3>Frequently Asked Questions</h3>
            </div>
            <div className={styles.faqBody}>
              <div className={styles?.cardDesignWrap}>
                {
                  faqArray?.map((item, index) => (
                    <div key={index} className={styles.cardStyle}>
                      <h4>{item?.question}</h4>
                      <p>{convertHtmlToTextWithBreaks(item?.answer)}</p>
                    </div>
                  ))
                }
              </div>
            </div>
          </section>
        </div>
      }
    </div>
  )
}

export default ShowData;
