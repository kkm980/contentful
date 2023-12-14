import { LanguageConstants } from '../../Constants/LanguageConstants';

const LanguageDropdown = function({dropDownOpen, setDropDownOpen, language, setLanguage}){
    const id = window.location.pathname;
    function checkUrl(e){
        let currentUrl = window.location.href;

        // Define the target language
        let targetLanguage = e;
        
        // Use a regular expression to check for the presence of -en or no language specifier
        let langRegex = /-(en|bg|fr|es)(?=$|\/)/;
        
        // Replace or add the language specifier
        let newUrl = currentUrl.replace(langRegex, `-${targetLanguage}`);
        
        // Redirect to the new URL
        window.location.href = newUrl;
    }

    function flagGenerator() {
        // Use a regular expression to match the last two letters after a hyphen
        const url = window.location.pathname;
        const match = url.match(/-(\w{2})(?=$|\/)/);
      
        // Check if a match is found
        if (match && match[1]) {
          setLanguage(match[1])
          return match[1]; // Return the last two-letter code
        } else {
          return null; // Return null if no match is found
        }
    }

    return (
        <div style={{ width: "auto", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "start", position: "fixed", paddingRight: "50px", right: "0", top: "10px" }}>
        <div style={{width: "auto", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", cursor:"pointer"}} onClick={() => { setDropDownOpen(!dropDownOpen) }} >
          <img src={`/flags/${flagGenerator()||"en"}.svg`} style={{ width: "30px", height: "30px", borderRadius: "30px", border: "1px solid red", marginRight: "5px" }}/>
          <span>{!dropDownOpen?flagGenerator()||"en":"Select Language"}</span>
        </div>
        {dropDownOpen && (
        <div>
          {LanguageConstants.map((e) => (
            <div
              key={e}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "auto",
                marginTop: "10px",
                cursor: "pointer"
              }}
              onClick={() => {
                setLanguage(e.code);
                setDropDownOpen(!dropDownOpen);
                console.log(id);
                checkUrl(e.code);
              }}
            >
              <img
                src={`/flags/${e.code}.svg`}
                // alt={`${e.language} flag`}
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "30px",
                  border: "1px solid red",
                  marginRight: "10px"
                }}
              />
              <span>{e.code}</span>
            </div>
          ))}
        </div>
      )}
      </div>
    )
}

export default LanguageDropdown;