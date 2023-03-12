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

export {
    getPlanTimeRange,
    getNumberOfColumns,
    getTimeAtGridPosition
}