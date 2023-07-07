import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

import styles from "./Home.module.css";
import Header from "./header/Header";
import SearchSection from "./searchSection/SearchSection";
import JobCard from "./jobCard/JobCard";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState();
  const [allSkills, setAllSkills] = useState(["first", "second"]);
  const [skills, setSkills] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const localData = JSON.parse(localStorage.getItem("data"));
    if (localData) {
      axios
        .get(process.env.REACT_APP_BASE_URL + "/authenticate", {
          headers: {
            token: localData.jwtToken,
          },
        })
        .then((res) => {
          if (res.data.status == 202) {
            setIsLoggedIn(true);
            setUserData(localData);
          }
        });
    }
  }, []);

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_BASE_URL + "/api/jobs")
      .then((res) => {setJobs(res.data); console.log(res.data)})
      .catch((res) => console.log("error fetching jobs", res));
  }, []);

  return (
    <div className={styles.main}>
      
      <Header isLoggedIn={isLoggedIn} userData={userData} />
      <div className={styles.searchSkillsWrapper}>
        
        <SearchSection isLoggedIn={isLoggedIn} allSkills={allSkills} skills={skills} setSkills={setSkills}  />
        
        {jobs.map((job) => {
          return <JobCard key={job} isLoggedIn={isLoggedIn} job={job}/>
        })}
      </div>
      
    </div>
  );
  
}
