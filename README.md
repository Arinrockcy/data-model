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
    </section>
    <section>
        <h1>
        </h1>
    </section>
</div>

