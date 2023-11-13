const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

//Create an init function
function init() {


    //Fetch the json object and console log it 
    d3.json(url).then(function (data) {
        console.log(data);


        //Initialize variable 
        let names = data.names;

        // Use D3 to select the dropdown menu
      
        let dropdownMenu = d3.select("#selDataset");

        // Iterate through the names dictionary and set the values for the dropdown
        for (i = 0; i < names.length; i++) {
            dropdownMenu
                .append('option')
                .text(names[i]) 
                .property('value', names[i])  

        }
        
        graphs(names[0]);
        demographic_info(names[0]);
        createGauge(names[0]);
    });
};

// Create a function for assigning initial demographic information.
function demographic_info(patient_id) {

    // Fetch the json object 
    d3.json(url).then(function (data) {

        // Initializing an array 
        let resultArray = data.metadata.filter(sampleObj => sampleObj.id == patient_id);
        
        // Initializing the metadata
        let info = resultArray[0];

        // Selecting div tag for sample metadata using D3

        let sample = d3.select("#sample-metadata");
        sample.html("")

        // Append the first row of metadata as a sample demographic info 
        for (let i in info) {
            sample
                .append("table")
                .text(`${i}: ${info[i]}`)
                .property('value', i)

        }

    });
};

// Create a function to generate graphs pertaning to the data
function graphs(patient_id) {

    // Fetch the json object and console log it
    d3.json(url).then(function (data) {

        // Initialize an array and set it to data.metadata to change everytime a new patient id is selected 
        let resultArray = data.samples.filter(sampleObj => sampleObj.id == patient_id);

        // Initialize the metadata to be displayed to a variable 
        let info = resultArray[0];

        // Initialize the various elements required for the bar graph from data to new variables
        let otu_ids = info.otu_ids;
        let otu_labels = info.otu_labels;
        let sample_values = info.sample_values;

        // Create the bar chart data for the top 10 OTUs found in the individual
        let barData = [
            {
                y: otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
                x: sample_values.slice(0, 10).reverse(),
                text: otu_labels.slice(0, 10).reverse(),
                type: "bar",
                orientation: "h",
            }
        ];

        // Horizontal bar chart layout
        let barLayout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: { t: 30, l: 150 }
        };

        Plotly.newPlot("bar", barData, barLayout);

        // Creating bubble graph for each patient id
        let bubbleData = [
            {
                x: otu_ids,
                y: sample_values,
                text: otu_labels,
                mode: "markers",
                marker: {
                    size: sample_values,
                    color: otu_ids,
                    colorscale: "Earth"
                }
            }
        ];

        // Bubble chart layout
        let bubbleLayout = {
            title: "Bacteria Cultures Per Sample",
            margin: { t: 0 },
            hovermode: "closest",
            xaxis: { title: "OTU ID" },
            margin: { t: 30 }
        };

        Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    });
};

// Create a function for every new user selection
function optionChanged(id) {
    demographic_info(id);
    graphs(id);
    createGauge(id);
};
init();