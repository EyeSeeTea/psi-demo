function getLabel(d) {
	if (d.shortName){
		return d.shortName;
	}else if (d.name){
		return d.name;
	}else{
		return d.id;
	}
}

function getFiles(childrenPointers){
	var children =  [];
	if (childrenPointers){
		for (var i=0; i < childrenPointers.length; i++) {
			$.ajax({
			  url: collapsibleTreePath + childrenPointers[i].id + ".json",
			  async: false,
			  dataType: 'json',
			  success: function (response) {
			  	children.push(response);
			  }
			});
		};
	}
	if (children.length == 0) children = null;
	return children;
}

function getChildren(node){
	var children = null;
	if (node._children != undefined){
		children = node._children;
	}
	else{
		children=getFiles(node.childNodes);
		if (children == null){
			node.isAFinalNode = true;
			showTip(node);
		}
	}
	return children;
}

//Toggle children on click.
function collapsibleTreeClick(d) {
  if (!d3.event.defaultPrevented) {
    if (d.isAFinalNode == undefined || d.isAFinalNode == false){
	  if (d.children) {
	    d._children = d.children;
	    d.children = null;
      } else {
	    d.children = getChildren(d);
	    d._children = null;
	  }
	  update();
	}
  }
}

function showTip(d){
	if (d.isAFinalNode){
		tip.show(d);
	}	
}

function getTipContent(d) {
	var content = "";
	if (d.description != undefined){
		content = "Description: <span style='color:red'>" + d.description + "</span>";
	}
	else{
		content = "Number of DataValues: <span style='color:red'>" + d.numberDataValues + "</span>";
	}
	return content;
}

//Color leaf nodes orange, and packages white or blue.
function color(d) {
	var color;
	if (d.isAFinalNode){
		color = "#fd8d3c";
	}
	else if ((d._children != undefined && d._children != null) || (d._children === undefined && d.children === undefined)){
		color = "#3182bd";
	}
	else if (d.children != undefined && d.children != null){
		color = "#c6dbef";
	}
	return color;
}
