import React from "react";
import styles from "./JobCard.module.css";

import peopleIcon from "./images/people.svg";
import flagIcon from "./images/flag.svg";
import rupeeIcon from "./images/rupee.svg";

export default function JobCard(props) {
  return (
    <div className={styles.jobsCard}>
      <div className={styles.jobCardLeftWrapper}>
        <div className={styles.companyLogoWrapper}>
          <img
            className={styles.companyLogo}
            src={props.job.logo}
            alt="company logo"
          ></img>
        </div>
        <div className={styles.jobDetailsWrapper}>
          <p className={styles.jobPosition}>{props.job.position}</p>
          <div className={styles.locationSalaryWrapper}>
            {props.job.noOfEmployees && (
              <span className={styles.detailWithIcon}>
                <img src={peopleIcon} alt="people icon" />
                <span className={styles.jobDetailText}>{props.job.noOfEmployees}</span>
              </span>
            )}
            {props.job.monthlySalary && (
              <span className={styles.detailWithIcon}>
                <img src={rupeeIcon} alt="rupee icon" />
                <span className={styles.jobDetailText}>{props.job.monthlySalary}</span>
              </span>
            )}
            {props.job.location && (
              <span className={styles.detailWithIcon}>
                <img src={flagIcon} style={{ width: "35%" }} alt="flag icon" />
                <span className={styles.jobDetailText}>{props.job.location}</span>
              </span>
            )}
          </div>
          <div className={styles.locatioModeWrapper}>
            <span className={styles.textDetail}>{props.job.workingMode}</span>
            <span className={styles.textDetail}>{props.job.jobType}</span>
          </div>
        </div>
      </div>

      <div className={styles.jobCardRightWrapper}>
        <div className={styles.skillsWrapper}>
            {props.job.skills.map((skill) => 
             <span className={styles.skillBlock}>{skill}</span>
            )}
        </div>
        <div className={styles.editDetailsButtons}>
            {props.isLoggedIn && <button className={styles.editJobBtn}>Edit job</button>}
            <button className={styles.viewDetailBtn}>View Details</button>
        </div>
      </div>

    </div>
  );
}
