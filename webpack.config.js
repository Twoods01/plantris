module.exports = {
    resolve: {
        fallback: {
            "assert": require.resolve("assert/"),
            "buffer": require.resolve("buffer/"),
            "stream": require.resolve("stream-browserify"),
            "util": require.resolve("util/")
        }
    }
}