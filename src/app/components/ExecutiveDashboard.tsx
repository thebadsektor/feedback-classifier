import DonutChart from "./data-viz/DonutChart";
import TimeSeriesChart from "./data-viz/TimeSeriesChart";
import PerPersonDatatable from "./data-viz/PerPersonDatatable";
import LLMMarkdown from "./data-viz/LLMMarkdown";
import HorizontalStackedBarGraph from "./data-viz/HorizontalStackedBarGraph";

const markdownContent = `
# Executive Summary: Employee Performance Review

**Employee Name:** [Employee Full Name]  
**Position:** [Job Title]  
**Department:** [Department Name]  
**Review Period:** [Start Date] - [End Date]  
**Reviewer:** [Reviewer Name]  

---

## Overview
This performance review evaluates [Employee Full Name]'s contributions, achievements, and areas for growth during the review period. The summary reflects their alignment with organizational goals, adherence to job responsibilities, and collaboration with team members.

---

## Key Achievements
1. **Project Contributions:**
   - Successfully completed [specific project name or task], achieving [quantifiable results or impact].
   - Demonstrated innovation in [specific skill or contribution].

2. **Skills and Competencies:**
   - Exhibited proficiency in [key skills], resulting in [specific outcomes or recognition].
   - Adapted to [new tools/processes] seamlessly, enhancing productivity.

3. **Collaboration and Teamwork:**
   - Actively contributed to [team or initiative], fostering a positive and productive environment.
   - Provided mentorship to team members, resulting in [specific improvements].

---

## Areas of Strength
- **Technical Expertise:** Demonstrated strong technical capabilities in [specific domain].
- **Problem-Solving:** Excelled in identifying and resolving complex challenges effectively.
- **Communication:** Maintained clear and effective communication with stakeholders and peers.

---

## Areas for Development
1. **Time Management:**
   - Recommendation: Focus on prioritizing tasks to meet tight deadlines without compromising quality.

2. **Leadership Skills:**
   - Recommendation: Take initiative in leading team projects to build confidence and leadership experience.

3. **Continuous Learning:**
   - Recommendation: Engage in training or certification programs to further enhance expertise in [specific skill].

---

## Performance Goals for Next Period
1. [Goal 1: Specific and Measurable Objective]
2. [Goal 2: Specific and Measurable Objective]
3. [Goal 3: Specific and Measurable Objective]

---

## Reviewer Comments
[Optional section for personalized comments or reflections on the employee's performance.]

---

## Employee Comments
[Optional section for the employee to provide feedback or comments regarding the review.]

---

## Final Rating
**Overall Performance Rating:** [Outstanding / Exceeds Expectations / Meets Expectations / Needs Improvement]  

---

## Acknowledgment
I acknowledge that this performance review has been discussed with me and that I have received a copy of this document.

**Employee Signature:** ________________________  **Date:** ______________  
**Reviewer Signature:** ________________________  **Date:** ______________  

`;

export default function ExecutiveDashboard() {
    return (
        <>
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Executive Summary</h1>
        </div>
            <div className="mt-4">
                <div className="flex gap-4">
                    <div className="bg-gray-100 rounded-md" style={{minWidth:400, minHeight:400,}}>
                        <div className="flex items-center justify-center h-full w-full">
                            <DonutChart />
                        </div>
                    </div>
                    <div className="flex-1 bg-gray-100 p-4 rounded-md" style={{ minHeight: 400 }}>
                        <div className="flex items-center justify-center h-full w-full">
                            <TimeSeriesChart style={{ width: '100%', height: '100%' }} />
                        </div>
                    </div>
                </div>
                <div className="bg-gray-100 p-4 rounded-md mt-4" style={{minHeight:400}}>
                    <div className="flex h-full" style={{ minHeight: '400px' }}>
                        <LLMMarkdown content={markdownContent} />
                    </div>
                </div>
                <div className="bg-gray-100 p-4 rounded-md mt-4" style={{minHeight:400}}>
                    <div className="flex items-center justify-center h-full w-full" style={{ minHeight: '400px' }}>
                        <HorizontalStackedBarGraph style={{ width: '100%', height: '100%' }}/>
                    </div>
                </div>
                <div className="bg-gray-100 p-4 rounded-md mt-4" style={{minHeight:400}}>
                    <div className="flex h-full" style={{ minHeight: '400px' }}>
                        <LLMMarkdown content={markdownContent} />
                    </div>
                </div>
                <div className="bg-gray-100 p-4 rounded-md mt-4" style={{minHeight:400}}>
                    <div className="flex items-center justify-center h-full" style={{ minHeight: '400px' }}>
                        <PerPersonDatatable />
                    </div>
                </div>
                <div className="bg-gray-100 p-4 rounded-md mt-4" style={{minHeight:400}}>
                    <div className="flex h-full" style={{ minHeight: '400px' }}>
                        <LLMMarkdown content={markdownContent} />
                    </div>
                </div>
            </div>
        </>
    );
}