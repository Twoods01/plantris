import dayjs from "dayjs";
import isEqual from "lodash.isequal";
import flatten from "lodash.flatten";
import { memo } from "react";
import GridLayout, { WidthProvider } from "react-grid-layout";

const WidthGrid = WidthProvider(GridLayout);
const RELEVANT_PROJECT_FIELDS = ["name", "x", "y", "w", "splits"];

function shouldSkipRender(oldProps, newProps) {
    const projectsHaveChanged = newProps.projects.reduce((hasAnyProjectChanged, project, i) => {
        const oldProject = oldProps.projects[i];
        const hasProjectChanged = RELEVANT_PROJECT_FIELDS.reduce((hasFieldChanged, field) => {
            return hasFieldChanged || !isEqual(project[field], oldProject[field]);
        }, 
        // If the id at the same index doesn't match then either the old project was deleted or a new project was added
        oldProject?.id !== project.id);

        return hasAnyProjectChanged || hasProjectChanged;
    }, false);
    const timeRangeHasChanged = isEqual(newProps.settings.timeRange, oldProps.settings.timeRange);

    return !projectsHaveChanged && !timeRangeHasChanged;
}

function buildLayout(project) {
    let estimate = parseInt(project.estimate);
    if (isNaN(estimate)) {
        estimate = undefined
    }
    return {
        i: project.id,
        name: project.name,
        x: project.x ?? 0,
        y: project.y ?? 0,
        w: project.w ?? estimate ?? 1,
        maxW: estimate,
        h: 1,
        minH: 1,
        maxH: 1
    };
}

const PlanGrid = memo(function PlanGrid(props) {
    function layoutChanged(layout) {
        const changes = Object.values(layout.reduce((acc, gridItem) => {
            const parent = props.projects.find(project => {
                const isMatch = project.id === gridItem.i;
                const containsSplit = (project.splits ?? []).find(split => split.id === gridItem.i);
                return isMatch || containsSplit;
            });

            if(!acc[parent.id]) {
                acc[parent.id] = {
                    id: parent.id,
                    splits: []
                };
            }

            // This gridItem is a split from the parent project
            if(parent.id !== gridItem.i) {
                acc[parent.id].splits.push({
                    id: gridItem.i,
                    name: parent.name,
                    x: gridItem.x,
                    y: gridItem.y,
                    w: gridItem.w
                });
            } else {
                acc[parent.id] = {
                    ...acc[parent.id],
                    x: gridItem.x,
                    y: gridItem.y,
                    w: gridItem.w
                };
            }
            
            return acc;
        }, {}))

        props.updateProjects(changes);
    }

    const layout = flatten(props.projects.map(project => {
        let splits = [];
        if(project.splits) {
            splits = project.splits.map(buildLayout) 
        }
        return [buildLayout(project)].concat(splits);
    }));

    const timeRange = props.settings.timeRange.map(dateString => dayjs(dateString));
    const columns = timeRange[1].diff(timeRange[0], props.settings.period);

    return (
        <WidthGrid
            className="grid-container"
            layout={layout}
            cols={columns}
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