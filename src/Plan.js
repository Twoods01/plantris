import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"
import "./Plan.css"
import Resources from "./Resources";
import Timeline from "./Timeline";
import PlanGrid from "./PlanGrid";

function Plan(props) {
    return (
        <div className="plan-container">
            <Timeline
                settings={props.settings}
                timeChanged={props.timeChanged}
            />
            <Resources
                resources={props.resources}
                addResource={props.addResource}
                removeResource={props.removeResource}
                rename={props.renameResource}
            />
            <PlanGrid
                projects={props.projects}
                settings={props.settings}
                updateProjects={props.updateProjects}
            />
        </div>
    )
};

export default Plan;