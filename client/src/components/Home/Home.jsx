import React from 'react'
import './Home.css'
import Header from './../common/header/Header'
import { useState, useEffect } from 'react'
import axios from 'axios'

function Skill(props) {
  return (
    <div className='skillBlock'>
      <span className='skillName'>
        {props.currentSkill}
      </span>
      <span onClick={() => {
        console.log( [...props.skills.splice(props.skills.indexOf(props.currentSkill), 1)])
        props.setSkills( [...props.skills.splice(props.skills.indexOf(props.currentSkill), 1)] );
      }} className='closeButton'>
        X
      </span>
    </div>
  )
}


export default function Home() {
  const [allSkills, setAllSkills] = useState(["first", "second"]);
  const [skills, setSkills] = useState(["CSS"]);
  useEffect( () => {
    let jobs = axios.get('http://localhost:8000/api/jobs')   
    console.log(jobs)

  }, [])
  

  return (
    <main>
      <Header />

      <div className='searchSection'>
        <div className='searchBoxWrapper'>
            <input className='searchInput' type="text" placeholder="&#xf002; Type any job title"></input>
            <div className='skillsSelectorWrapper'> 
              <div className='skillsSelector'>
                <select id="skills" name="skills" disabled={!allSkills.length}
                onChange={(item) => {
                  if(!skills.includes(item.currentTarget.value)  && item.currentTarget.value!==""){
                    setSkills([...skills, item.currentTarget.value])
                  }
                }}
                >
                  <option value="">Skills</option>
                  {allSkills.map((item) => <option key={item} value={item}>{item}</option>
                  )}
                </select> 
              </div>
              <div className='skillsList'>
                {skills.map((item) => <Skill key={item} currentSkill={item} skills={skills} setSkills={setSkills} /> ) }
              </div>
            </div>

        </div>
      </div>
    </main>
  )
}
