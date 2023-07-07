import React from "react";
import styles from "./searchSection.module.css";

function Skill(props) {
  return (
    <div className={styles.skillBlock}>
      <span className={styles.skillName}>{props.currentSkill}</span>
      <span
        onClick={() => {
          props.setSkills((skills) => [
            ...skills.splice(skills.indexOf(props.currentSkill), 1),
          ]);
        }}
        className={styles.closeButton}
      >
        X
      </span>
    </div>
  );
}

export default function SearchSection(props) {
  return (
    <>
      <div className={styles.searchSection}>
        <div className={styles.searchBoxWrapper}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Type any job title"
          ></input>
        </div>

        <div className={styles.skillsSelectorWrapper} >
          <div className={styles.skillsSelectorInnterWrapper} style={props.isLoggedIn ? {width: "80%"} : {width: "100%"}}>
            <div className={styles.skillsLeftWrapper}>
              <div className={styles.skillsSelector}>
                <select
                  className={styles.selectSkills}
                  name="skills"
                  disabled={!props.allSkills.length}
                  onChange={(item) => {
                    if (
                      !props.skills.includes(item.currentTarget.value) &&
                      item.currentTarget.value !== ""
                    ) {
                      props.setSkills([
                        ...props.skills,
                        item.currentTarget.value,
                      ]);
                    }
                  }}
                >
                  <option value="">Skills</option>
                  {props.allSkills.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.skillsList}>
                {props.skills.map((item) => (
                  <Skill
                    key={item}
                    currentSkill={item}
                    setSkills={props.setSkills}
                  />
                ))}
              </div>
            </div>

            {props.skills.length > 0 && (
              <span className={styles.clearSkills} style={props.isLoggedIn ? {width: "90%", justifySelf:"flex-end!important"} : {}} onClick={() => props.setSkills([])} >Clear</span>
            )}
          </div>

          {props.isLoggedIn && <div className={styles.addJobBtnWrapper}> 
            <button className={styles.addJobButton}>+Add Job</button>
          </div>
          }
        </div>
      </div>
    </>
  );
}
