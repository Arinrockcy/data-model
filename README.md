<div>
    <h1>Data Model</h1>
    <section>
        <h1>Introduction</h1>
        <p>
            Created to support code first methodology. By passing JSON based domainModel.
        </p>
        <p> 
            Path to sample domainModel file <br/> <code>src\constants\domain.model.js</code>
        </p>
        <p> 
            It processes and validates and creates read/write  queries. Switching between DB will be easy. With minimal code changes, we need to change DB controller alone.
        </p>
    </section>
    <section>
        <h1>Initiate Data Model</h1>
        <p>
            Sample code to initiate data model
            <br/>
            <code>
                const model = new DataModel({
                   <br/> domainModel: domainModel,
                    <br/> dbConfig: 'string to connect mongoDB'
                <br/> });
            </code>
        </p>
        <div style="left:10px">
            <h2>
                Create DataContainer
            </h2>
            <p>
                create datacontainer 
            <br/>
            <code>const dataContainer = model.createDataContainer </code>
            </p>
                <div style="left:10px">
                    <h2>
                        Read
                    </h2>
                    <p>
                        use the container created
                        Path to test case
                        </br>
                        <code>__tests__\read.test.js </code>
                    </p>
                </div>
                <div style="left:10px">
                    <h2>
                        Write
                    </h2>
                    <p>
                        use the container created
                        Path to test case
                        </br>
                        <code>__tests__\write.test.js</code>
                    </p>
                </div>
        </div>
    </section>
    <section>
        <h1>
        </h1>
    </section>
</div>

