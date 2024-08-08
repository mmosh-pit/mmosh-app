"use client";

import ProjectCreateStep1 from "@/app/components/Project/ProjectCreateStep1";
import ProjectCreateStep2 from "@/app/components/Project/ProjectCreateStep2";
import ProjectCreateStep3 from "@/app/components/Project/ProjectCreateStep3";
import ProjectCreateStep4 from "@/app/components/Project/ProjectCreateStep4";
import ProjectCreateStep5 from "@/app/components/Project/ProjectCreateStep5";
import ProjectCreateStep6 from "@/app/components/Project/ProjectCreateStep6";
import ProjectCreateStep7 from "@/app/components/Project/ProjectCreateStep7";
import ProjectCreateStep8 from "@/app/components/Project/ProjectCreateStep8";
import ProjectCreateStep9 from "@/app/components/Project/ProjectCreateStep9";
import ProjectCreateStep10 from "@/app/components/Project/ProjectCreateStep10";
import { useEffect, useState } from "react";
import next from "next";

export default function ProjectCreate() {
    const [currentStep, setCurrentStep] = useState<any>("")

    useEffect(()=>{
      console.log("currentprojectstep", localStorage.getItem("currentprojectstep"))
      if(localStorage.getItem("currentprojectstep") ) {
          setCurrentStep(localStorage.getItem("currentprojectstep"))
      } else {
         console.log("localStorage step1")
          setCurrentStep("step1")
      }
    },[])

    useEffect(()=>{
      if(currentStep!=="") {
         localStorage.setItem("currentprojectstep",currentStep)
      }
    },[currentStep])
    
    const onPageChange = (nextStep:any) => {
        console.log("nett setup", nextStep)
        setCurrentStep(nextStep)
    }

    return (
        <>
        {currentStep === "step1" &&
           <ProjectCreateStep1 onPageChange={onPageChange}/>
        }
        {currentStep === "step2" &&
           <ProjectCreateStep2 onPageChange={onPageChange}/>
        }
        {currentStep === "step3" &&
           <ProjectCreateStep3 onPageChange={onPageChange}/>
        }
        {currentStep === "step4" &&
           <ProjectCreateStep4 onPageChange={onPageChange}/>
        }
        {currentStep === "step5" &&
           <ProjectCreateStep5 onPageChange={onPageChange}/>
        }
        {currentStep === "step6" &&
           <ProjectCreateStep6 onPageChange={onPageChange}/>
        }
        {currentStep === "step7" &&
           <ProjectCreateStep7 onPageChange={onPageChange}/>
        }
        {currentStep === "step8" &&
           <ProjectCreateStep8 onPageChange={onPageChange}/>
        }
        {currentStep === "step9" &&
           <ProjectCreateStep9 onPageChange={onPageChange}/>
        }
        {currentStep === "step10" &&
           <ProjectCreateStep10 onPageChange={onPageChange}/>
        }
        </>
    );
}
