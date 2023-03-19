import isEqual from "lodash.isequal";
import isNil from "lodash.isnil";
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

function fillRow(project, grid, settings) {
    if (isNil(grid[project.y])) {
        grid[project.y] = new Array(getNumberOfColumns(settings));
    }

    const row = grid[project.y];

    for (let i = project.x; i < project.x + project.w; i++) {
        row[i] = 1;
    }
}

function findOptimalPosition(project, duration = 1, projects, resources, settings) {
    const position = {
        x: 0,
        y: 0,
        w: duration
    }

    const grid = new Array(resources.length);
    projects.forEach(project => {
        if(!isNil(project.x) && !isNil(project.y) && !isNil(project.w)) {
            fillRow(project, grid, settings);
            (project.splits ?? []).forEach(split => {
                fillRow(split, grid, settings);
            });
        }
    });

    let positionFound = false;
    for(let y = 0; y < grid.length; y++) {
        const row = grid[y];
        let locationStart;
        for(let x = 0; x < row.length; x++) {
            if (isNil(row[x])) {
                if (isNil(locationStart)) {
                    locationStart = x;
                } else if (x - locationStart === duration) {
                    position.x = locationStart;
                    position.y = y;
                    positionFound = true;
                    break;
                }
            } else if(!isNil(locationStart)) {
                locationStart = undefined;
            }
        }

        if (!isNil(locationStart) && row.length - locationStart === duration) {
            position.x = locationStart;
            position.y = y;
            positionFound = true;
        }

        locationStart = undefined;

        if (positionFound) {
            break;
        }
    }

    if (!positionFound) {
        position.x = 0;
        position.y = grid.length;
    }


    return position;
}

function buildLayout(project, projects, resources, settings) {
    let estimate = parseInt(project.estimate);
    if (isNaN(estimate)) {
        estimate = undefined
    }
    const duration = project.w ?? estimate;

    const defaults = { };
    if (isNil(project.x)) {
        Object.assign(defaults, findOptimalPosition(project, duration, projects, resources, settings));
    }

    return {
        i: project.id,
        name: project.name,
        x: project.x ?? defaults.x,
        y: project.y ?? defaults.y,
        w: duration ?? defaults.w,
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
            splits = project.splits.map(split => buildLayout(split, props.projects, props.resources, props.settings));
        }
        const allProjectSegments = [buildLayout(project, props.projects, props.resources, props.settings)].concat(splits);
        const fullyPlanned = getPlanningIssues(project, props.settings, props.resources).length === 0;
        allProjectSegments.forEach(projectSegment => {
            Object.assign(projectSegment, {
                fullyPlanned,
                static: project.static
            });
            if (!props.settings.constrainProjectByEstimate) {
                delete projectSegment.maxW;
            }
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