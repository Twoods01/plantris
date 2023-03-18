import dayjs from "dayjs";

function getPlanTimeRange(settings) {
    return settings.timeRange.map(dateString => dayjs(dateString));
}

function getNumberOfColumns(settings) {
    const timeRange = getPlanTimeRange(settings);
    return timeRange[1].diff(timeRange[0], settings.period);
}

function getTimeAtGridPosition(x, settings) {
    const timeRange = getPlanTimeRange(settings);
    return timeRange[0].add(x, settings.period);
}

function getPlannedProjectDuration(project) {
    const splitWidth = (project.splits ?? []).reduce((acc, split) => { return acc + split.w; }, 0);
    return project.w + splitWidth;
}  

function getProjectStartDate(project, settings) {
    return getTimeAtGridPosition(project.x, settings).format("YYYY-MM-DD");
}

function getProjectEndDate(project, settings) {
    let projectEnd = project.x + project.w;
    (project.splits ?? []).forEach(split => {
        projectEnd = Math.max(projectEnd, split.x + split.w);
    });
    return getTimeAtGridPosition(projectEnd, settings).format("YYYY-MM-DD");
}

function notAssignedToResource(project, resources) {
    return (project.splits ?? []).reduce((notAssigned, split) => {
        return notAssigned || split.y >= resources.length;
    }, project.y >= resources.length);
}

function getPlanningIssues(project, settings, resources) {
    const warnings = [];
    //Not full planned
    const duration = getPlannedProjectDuration(project);
    if (project.estimate && project.w && duration !== parseInt(project.estimate)) {
        const descriptor = duration < project.estimate ? "under" : "over"
        warnings.push(`Project is ${descriptor}planned by ${Math.abs(parseInt(project.estimate) - duration)} ${settings.period}`);
    }

    const endDate = getProjectEndDate(project, settings);
    if (dayjs(endDate).isAfter(project.dueDate)) {
        warnings.push(`Project finishes at ${endDate} but is due by ${project.dueDate.format("YYYY-MM-DD")}`);
    }

    if (notAssignedToResource(project, resources)) {
        warnings.push("Project is not assigned to a resource");
    }

    return warnings;
}

export {
    getPlanTimeRange,
    getPlanningIssues,
    getProjectStartDate,
    getProjectEndDate,
    getNumberOfColumns,
    getTimeAtGridPosition
}