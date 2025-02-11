// Credit to Alan at https://codepen.io/amwill04/pen/NGmjyr

// When on tablet or phone, initially run or restart the pen from under 767px screen width so that the angle of the selected pie slice animates down instead of to the right when the description box is underneath it.

var data = [{
    "Title": "HTML",
    "Amount": 10000,
    "Description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent rutrum metus vel odio convallis condimentum. Integer ullamcorper ipsum vel dui varius congue. Nulla facilisi. Morbi molestie tortor libero, ac placerat urna mollis ac. Vestibulum id ipsum mauris."
  }, {
    "Title": "CSS",
    "Amount": 1000,
    "Description": "In hac habitasse platea dictumst. Curabitur lacus neque, congue ac quam a, sagittis accumsan mauris. Suspendisse et nisl eros. Fusce nulla mi, tincidunt non faucibus vitae, aliquam vel dolor. Maecenas imperdiet, elit eget condimentum fermentum, sem lorem fringilla felis, vitae cursus lorem elit in risus."
  }, {
    "Title": "Javascript",
    "Amount": 1750,
    "Description": "Aenean faucibus, risus sed eleifend rutrum, leo diam porttitor mauris, a eleifend ipsum ipsum ac ex. Nam scelerisque feugiat augue ac porta. Morbi massa ante, interdum sed nulla nec, finibus cursus augue. Phasellus nunc neque, blandit a nunc ut, mattis elementum arcu."
  }];
  
  var width = parseInt(d3.select('#pieChart').style('width'), 10);
  var height = width;
  var radius = (Math.min(width, height) - 15) / 2;
  
  var total = 0;      // used to calculate %s
  data.forEach((d) => {
    total += d.Amount;
  })
  
  var title = function getObject(obj) {
    titles = [];
    for (var i = 0; i < obj.length; i++) {
      titles.push(obj[i].Title);
    }
    return titles
  };
  
  // grabs the responsive value in 'counter-reset' css value
  let innerRadius = $('#pieChart').css('counter-reset').split(' ')[1];
  
  var arcOver = d3.arc()
    .outerRadius(radius + 10)
    .innerRadius(innerRadius);
  
  
  var color = d3.scaleOrdinal(); 
  color.domain(title(data))
    // Comment in/out between ranges below to change colors
    .range(["#2BDFBB", "#DF2B4F", "#EE6617", "#FFBF00", '#423E6E', '#E24161']);
    //.range(["#FFFFFF", "#0057E7", "#D62D20", "#008744", "#FFA700", "#0057E7"]);
    //.range(["#011F4B", "#03396C", "#005B96", "#6497B1", "#B3CDE0"]);
    //.range(["#B2D8D8", "#66B2B2", "#008080", "#006666", "#004C4C"]);
    //.range(["#DC6900", "#EB8C00", "#E0301E", "#A32020", "#602320"]);
    //.range(["#D11141", "#00B159", "#00AEDB", "#FFC425", "#F37735"]);
    //.range(["#BD0C2F", "#D15238", "#4F283D", "#17263E", "#345999"]);
    //.range(["#FE0000", "#FDFE02", "#0BFF01", "#011EFE", "#FE00F6"]);
    //.range(['#0B00FF', '#0097FF', '#00FFF0', '#00FF74', '#0BFF00', '#FFF900', '#FF5500', '#FF0500', '#FF007F', '#B800FF', '#99FF00']);
    //.range(["#8A76A6", "#54B5BF", "#8EA65B", "#F27B35"]);
  
  // Comment Out Below to Use Diff D3 Color Scheme
  // var color = d3.scaleOrdinal(d3.schemeCategory10);
  // color.domain(title(data))
  
  var arc = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(innerRadius);
  
  var pie = d3.pie()
    .sort(null)
    .value(function(d) {
      return +d.Amount;
    });
  
  
  // direction of the slice angle (for responsiveness)
  let sliceDirection = 90;
  if(window.matchMedia("(max-width: 767px)").matches) {
    sliceDirection = 180;
  }
  
  
  var prevSegment = null;
  var change = function(d, i) {
    var angle = sliceDirection - ((d.startAngle * (180 / Math.PI)) +((d.endAngle - d.startAngle) * (180 / Math.PI) / 2));
  
    svg.transition()
      .duration(1000)
      .attr("transform", "translate(" + radius +
            "," + height / 2 + ") rotate(" + angle + ")");
    d3.select(prevSegment)
      .transition()
      .attr("d", arc)
      .style('filter', '');
    prevSegment = i;
  
    d3.select(i)
      .transition()
      .duration(1000)
      .attr("d", arcOver)
      .style("filter", "url(#drop-shadow)");
  };
  
  
  var svg = d3.select("#pieChart").append("svg")
    .attr("width", '100%')
    .attr("height", '100%')
    .attr('viewBox', '0 0 ' + Math.min(width, height) + ' ' + Math.min(width, height))
    .attr('preserveAspectRatio', 'xMinYMin')
    .append("g")
    .attr("transform", "translate(" + radius + "," + height / 2 + ")")
    .style("filter", "url(#drop-shadow)");
  
  
  // Create Drop Shadow on Pie Chart
  var defs = svg.append("defs");
  var filter = defs.append("filter")
      .attr("id", "drop-shadow")
      .attr("height", "130%");
  
  filter.append("feGaussianBlur")
      .attr("in", "SourceAlpha")
      .attr("stdDeviation", 5.5)
      .attr("result", "blur");
  
  filter.append("feOffset")
      .attr("in", "blur")
      .attr("dx", 0)
      .attr("dy", 0)
      .attr("result", "offsetBlur");
  
  var feMerge = filter.append("feMerge");
  feMerge.append("feMergeNode")
      .attr("in", "offsetBlur")
  feMerge.append("feMergeNode")
      .attr("in", "SourceGraphic");
  
  
  // toggle to allow animation to halfway finish before switching segment again
  var buttonToggle = true;
  var switchToggle = () => {
    setTimeout(() => {
      buttonToggle = true;
    }, 1500)
  }
  
  var timeline = new TimelineLite();
  
  var g = svg.selectAll("path")
    .data(pie(data))
    .enter().append("path")
    .style("fill", function(d) {
      return color(d.data.Title);
    })
    .attr("d", arc)
    .style("fill", function(d) {
      return color(d.data.Title);
    })
    .on("click", function(d) {
      
      if(buttonToggle) {
        buttonToggle = false;
        switchToggle();
        
        change(d, this);
        
        var timeline = new TimelineLite();
  
        //TweenMax.set(".panel", {perspective:800});
        //TweenMax.set(".content-wrapper", {transformStyle:"preserve-3d"});
  
        timeline.to('.content-wrapper', .5, {
          rotationX: '90deg',
          opacity: 0,
          ease: Linear.easeNone,
          onComplete: () => {$('.content-wrapper').hide();}
        }).to('.panel', .5, {
          width: '0%',
          opacity: .05,
          ease: Linear.easeNone,
          onComplete: () => {
            $('#segmentTitle').replaceWith(`<h1 id="segmentTitle">${d.data.Title} - ${Math.round((d.data.Amount/total) * 1000) / 10}%</h1>`);
            $('#segmentText').replaceWith('<p id="segmentText">' + d.data.Description + '</p>');
            $('.panel').css('background-color', `${ColorLuminance(color(d.data.Title), -0.3)}`)
          }
        });
  
  
        timeline.to('.panel', .5, {
          width: '100%',
          opacity: 1,
          ease: Linear.easeNone,
          onComplete: () => {$('.content-wrapper').show();}
        }).to('.content-wrapper', .5, {
          rotationX: '0deg',
          opacity: 1,
          ease: Linear.easeNone,
        })
      }
    });
  
  
  timeline.from('#pieChart', .5, {
    rotation: '-120deg',
    scale: .1,
    opacity: 0,
    ease: Power3.easeOut,
  }).from('.panel', .75, {
    width: '0%',
    opacity: 0,
    ease: Linear.easeNone,
    onComplete: () => {$('.content-wrapper').show();}
  }, '+=.55').from('.content-wrapper', .75, {
    rotationX: '-90deg',
    opacity: 0,
    ease: Linear.easeNone,
  })
  
  
  // Function to darken Hex colors
  function ColorLuminance(hex, lum) {
  
      // validate hex string
      hex = String(hex).replace(/[^0-9a-f]/gi, '');
      if (hex.length < 6) {
          hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
      }
      lum = lum || 0;
  
      // convert to decimal and change luminosity
      var rgb = "#", c, i;
      for (i = 0; i < 3; i++) {
          c = parseInt(hex.substr(i*2,2), 16);
          c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
          rgb += ("00"+c).substr(c.length);
      }
  
      return rgb;
  }
  
  
  //document.querySelector('style').textContent += '@media(max-width:767px) {#pieChart { transform: rotate(90deg); transform-origin: 50% 50%; transition: 1s; max-width: 50%; } .text-container { width: 100%; min-height: 0; }} @media(min-width:768px) {#pieChart { transition: 1s;}}'