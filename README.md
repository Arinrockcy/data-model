<div>
    <h1>Data Model</h1>
    <section>
        In the ever-evolving landscape of data storage and management, having an Object-Relational Mapping (ORM) system that seamlessly interfaces with multiple databases and diverse types is paramount. Our ORM solution goes beyond the conventional boundaries, providing developers with unparalleled flexibility and ease of use.

Key Features
<h2> 1. Database Agnosticism</h2>

<p>Our ORM system is designed to be database-agnostic, allowing developers to work with various databases without the need for extensive modifications to their codebase. Whether you're dealing with relational databases like MySQL and PostgreSQL, NoSQL databases such as MongoDB, or any other database technology, our ORM system ensures a consistent and unified interface.</p>

<h2>2. Support for Multiple Database Types</h2>

<p>Not only does our ORM system support different databases, but it also caters to various database types. This includes traditional relational databases, document-oriented databases, key-value stores, and more. You can seamlessly switch between different database paradigms based on the specific needs of your application, all while maintaining a consistent data access layer.</p>

<h2>3. Dynamic Schema Mapping</h2>

<p>Our ORM system excels in dynamically mapping object-oriented code structures to different database schemas. Whether you're working with a schema-less NoSQL database or a rigidly structured SQL database, the ORM intelligently adapts to the underlying data model, providing developers with the freedom to model their data in a way that makes the most sense for their application.</p>

<h2>4. Effortless Cross-Database Queries</h2>

<p>Say goodbye to the challenges of handling data across multiple databases. Our ORM system simplifies cross-database queries, allowing developers to perform complex operations that involve data residing in different databases with ease. This capability is particularly valuable in microservices architectures where data may be distributed across multiple storage systems.</p>

<h2>5. Extensible Architecture</h2>

<p>Built with extensibility in mind, our ORM system allows developers to incorporate custom database drivers and adaptors. This extensibility ensures that the ORM can seamlessly integrate with emerging database technologies, keeping your application future-proof and ready to embrace new advancements in the database landscape.</p>
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

