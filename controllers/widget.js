/*
 args = {
 	class: null, // or tss classname 
 	maxHeight: 80,
 	hintText: 'Enter message...'
 }
 * */
var args = arguments[0] || {};
args.maxHeight = args.maxHeight || 80;

init();
function init() {
	var exclude = ['id', 'maxHeight', 'hintText'],
		style = _.omit(args, exclude);
	
	$.getView().applyProperties(style);
	
	if (style.height) {
		$.textarea.height = parseInt(style.height, 10);
	} else {
		$.textarea.addEventListener('postlayout', textareaPostlayout);
	}
	
	if (args.hintText) {
		setHintText(args.hintText);
	}
};

function textareaChange(e) {
	var value = this.value;
	
	// toggle hint text
  	if (OS_IOS) {
  		if (value.length > 0) {
			$.hint.hide();
		} else {
			$.hint.show();
		}
  	}
  	
  	// reset textarea height
  	if (this._len && value.length < this._len) {
  		this.height = Ti.UI.SIZE;
  	}
  	
  	$.trigger('change', { value: value });
}

// limit textarea height, less than args.maxHeight
function textareaPostlayout(e) {
  	if (this.rect.height > args.maxHeight) {
  		this._len = this.value.length;
  		this.height = args.maxHeight;
  	}
  	
  	$.trigger('resize', { height: this.rect.height });
}

exports.getHeight = function() {
	return $.textarea.rect.height;
};

exports.getValue = function() {
	return $.textarea.value.trim();
};

exports.setValue = function(value) {
	$.textarea.value = value;
	return textareaChange.call( $.textarea );
};

function setHintText(hintText) {
	if (OS_IOS) {
		$.hint.text = hintText;
	} else {
		$.textarea.hintText = hintText;
	}
}
exports.setHintText = setHintText;

exports.updateUI = function(style) {
	$.getView().applyProperties(style);
};