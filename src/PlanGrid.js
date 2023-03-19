import isEqual from "lodash.isequal";
import flatten from "lodash.flatten";
import { memo } from "react";
import GridLayout, { WidthProvider } from "react-grid-layout";
import { getNumberOfColumns, getPlanningIssues } from "./utils";

const WidthGrid = WidthProvider(GridLayout);
const RELEVANT_PROJECT_FIELDS = ["name", "estimate", "splits", "dueDate", "static"];

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
    const resourcesHaveChange = isEqual(newProps.resources, oldProps.resources);

    return !projectsHaveChanged && !timeRangeHasChanged && !resourcesHaveChange;
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
        maxH: 1,
        fullyPlanned: false
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
            splits = project.splits.map(buildLayout);
        }
        const allProjectSegments = [buildLayout(project)].concat(splits);
        const fullyPlanned = getPlanningIssues(project, props.settings, props.resources).length === 0;
        allProjectSegments.forEach(projectSegment => {
            Object.assign(projectSegment, {
                fullyPlanned,
                static: project.static
            });
        });

        return allProjectSegments;
    }));

    const columns = getNumberOfColumns(props.settings);

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
            {layout.map(project => {
                const classes = [];
                if (project.fullyPlanned) {
                    classes.push("grid-item-success");
                } else {
                    classes.push("grid-item-warning");
                }

                if(project.static) {
                    classes.push("locked");
                }

                return <div className={classes.join(" ")} key={project.i}>{project.name}</div>
            })}
        </WidthGrid>
    );
}, shouldSkipRender);

export default PlanGrid;