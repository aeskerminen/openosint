const DatapointExplorer = () => {
    return (
        <div className="flex flex-col h-screen items-center justify-center flex-1">
            <p className="text-2xl font-bold mb-4">Datapoint Explorer</p>

            {/* Form for uploading a picture (datapoint)*/}
            <div className="flex-1">Upload</div>

            {/* List of all datapoints fetched from the backend */}
            <div className="flex-1">Datapoints</div>

        </div>
    )
}

export default DatapointExplorer;