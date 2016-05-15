// Handle leaflet layer actions

function handleLayer(layer){
    var randomValue = Math.random(),
        fillColor = chroma
            .scale(['#D5E3FF', '#003171'])
            //	.scale('RdYlBu')
            .domain([0,1])
            .hex();

    layer.setStyle({
        fillColor : fillColor,
        fillOpacity: 1,
        color:'#555',
        weight:1,
        opacity:0.5
    });

    layer.on({
        click: clickLayer
    });
}

// Click Layer action
var clickedLayer;
function clickLayer(){
    // Un-mark previous selected layer
    if(clickedLayer){
        clickedLayer.bringToBack();
        clickedLayer.setStyle({
            weight:1,
            opacity:.5
        });
    }

    // Save clicked layer
    clickedLayer = this;
    var countryName = this.feature.properties.OPS_CODE;
    $('.dashboard > .content')
        .text('Κωδικός ΟΠΣ:'+countryName);
    // Mark selected layer
    clickedLayer.bringToFront();
    clickedLayer.setStyle({
        weight:2,
        opacity: 1
    });

}
