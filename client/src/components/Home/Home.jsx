import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

import styles from "./Home.module.css";
import Header from "../common/header/Header";
import SearchSection from "./searchSection/SearchSection";
import JobCard from "./jobCard/JobCard";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import loadingGif from "./../common/loading.svg";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState();
  const [allSkills, setAllSkills] = useState([]);
  const [skills, setSkills] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [searchBy, setSearchBy] = useState([]);

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
      .then((res) => {
        let allSkillsToSet = [];
        res.data.map((jobItem) => {
          jobItem.skills.map((jobSkill) => {
            if (!allSkillsToSet.includes(jobSkill)) {
              allSkillsToSet.push(jobSkill);
            }
          });
        });
        setAllSkills(allSkillsToSet);
        setAllJobs(res.data);
      })
      .catch(() => console.log("Something went wrong!!"));
  }, []);

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_BASE_URL + "/api/jobs", {
        params: { filterBySkills: skills },
      })
      .then((res) => {
        setJobs(res.data);
        setAllJobs(res.data);
      })
      .catch((res) => console.log("error fetching jobs", res));
  }, [skills]);

  useEffect(() => {
    if (searchBy === "") {
      setJobs([...allJobs]);
    } else {
      setJobs([
        ...allJobs.filter((jobItem) =>
          jobItem.position.toLowerCase().includes(searchBy)
        ),
      ]);
    }
  }, [searchBy, skills]);

  return (
    <div className={styles.main}>
      <Header isLoggedIn={isLoggedIn} userData={userData} />
      <div className={styles.searchSkillsWrapper}>
        <SearchSection
          setSearchBy={setSearchBy}
          isLoggedIn={isLoggedIn}
          allSkills={allSkills}
          skills={skills}
          setSkills={setSkills}
        />
        {jobs.length !== 0 ? (
          jobs.map((job) => {
            return <JobCard key={job._id} isLoggedIn={isLoggedIn} job={job} />;
          })
        ) : (
          <img width="200px" src={loadingGif} alt="Loading Animation!!" />
        )}
      </div>
      <ToastContainer position="bottom-left" />
    </div>
  );
}
