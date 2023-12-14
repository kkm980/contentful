import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import styles from './BlogData.module.scss';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { createClient } from "contentful";
const BlogData = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [cryptoArray, setCryptoArray] = useState([]);
  const [faqArray, setFaqArray] = useState([]);
  const { id, href } = useParams();
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
      const filteredItems = data?.items?.find((item) => item?.fields?.slug.split("/")[1] === id);
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
    console.log(filteredData, "filteredData");
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
           
            <div className={styles.heroSectionWrapper}>
              <h3 style={{marginBottom:"20px"}}>{filteredData?.fields?.heroTitle}</h3>
              <p>{filteredData?.fields?.description}</p>
            </div>

             <div className={styles.heroImageWrapper}>
              <img src={`${filteredData?.fields?.blogImage1?.fields?.file?.url}`} alt='Frame1.png' />
              <img src={`${filteredData?.fields?.blogImage2?.fields?.file?.url}`} alt='Frame2.png' />
            </div>

            <div className={styles.nextWrapper}>
              <div className={styles.descriptionText}>{filteredData?.fields?.descriptionText}</div>
              <div style={{marginTop:"10px", textAlign:"right", color:"blue", fontWeight:"bold"}}>- {id.split("-")[0]}</div>
              <div style={{height: "100px"}}>
              </div>
            </div>
          </div>
          <div style={{height: "100px"}}>
          </div>
        </div>
      }
    </div>
  )
}

export default BlogData;
