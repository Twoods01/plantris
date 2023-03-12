import isEqual from "lodash.isequal";
import { memo } from "react";
import GridLayout, { WidthProvider } from "react-grid-layout";

const WidthGrid = WidthProvider(GridLayout);
const RELEVANT_PROJECT_FIELDS = ["name", "x", "y", "w"];

function shouldSkipRender(oldProps, newProps) {
    const hasChanged = newProps.projects.reduce((hasAnyProjectChanged, project, i) => {
        const oldProject = oldProps.projects[i];
        const hasProjectChanged = RELEVANT_PROJECT_FIELDS.reduce((hasFieldChanged, field) => {
            return hasFieldChanged || !isEqual(project[field], oldProject[field]);
        }, 
        // If the id at the same index doesn't match then either the old project was deleted or a new project was added
        oldProject.id !== project.id);

        return hasAnyProjectChanged || hasProjectChanged;
    }, false);

    return !hasChanged;
}

const PlanGrid = memo(function PlanGrid(props) {
    function layoutChanged(layout) {
        const changes = layout.map(gridItem => {
            return {
                id: gridItem.i,
                x: gridItem.x,
                y: gridItem.y,
                w: gridItem.w
            };
        })

        props.updateProjects(changes);
    }

    const layout = props.projects.map(project => {
        return {
            i: project.id,
            name: project.name,
            x: project.x ?? 0,
            y: project.y ?? 0,
            w: project.w ?? project.estimate ?? 1,
            maxW: project.estimate ?? 1,
            h: 1,
            minH: 1,
            maxH: 1
        }
    });

    return (
        <WidthGrid
            className="grid-container"
            layout={layout}
            cols={12}
            rowHeight={30}
            autoSize={true}
            compactType="horizontal"
            onLayoutChange={layoutChanged}
        >
            {layout.map(project => <div key={project.i}>{project.name}</div>)}
        </WidthGrid>
    );
}, shouldSkipRender);

export default PlanGrid;