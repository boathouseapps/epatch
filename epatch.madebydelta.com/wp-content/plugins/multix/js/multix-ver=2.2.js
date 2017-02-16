var multix_displayed = false;
var multix_box_displayed = null;
var multix_offset_position = 0;
jQuery(document).ready(function() {
	jQuery(".multix_box_container").css("max-width", jQuery(window).width()-20);
	jQuery("#multix_exact_link_input").val(window.location.href);
	var multix_currenturl = window.location.href;
	if (multix_currenturl.indexOf("#pos") != -1) {
		var multix_tmp = multix_currenturl.substr(multix_currenturl.indexOf("#pos")+4);
		var intRegex = /^\d+$/;
		if(intRegex.test(multix_tmp)) {
			multix_offset_position = parseInt(parseFloat("0."+multix_tmp)*jQuery('html, body').height());
			jQuery('html, body').stop().animate({scrollTop: multix_offset_position}, 500);
		}
	}
	jQuery(window).scroll(function() {
		multix_offset_position = jQuery(window).scrollTop();
		var multix_height = jQuery('html, body').height();
		if (multix_offset_position != 0 && multix_offset_position <= multix_height) {
			var multix_url = window.location.href;
			var multix_tmp = multix_offset_position/multix_height;
			var multix_index = multix_tmp.toFixed(4).toString().substr(2,4);
			if (multix_url.indexOf("#") != -1) {
				multix_url = multix_url.substr(0, multix_url.indexOf("#"))+"#pos"+multix_index;
			} else multix_url = multix_url+"#pos"+multix_index;
			jQuery("#multix_exact_link_input").val(multix_url);
		} else jQuery("#multix_exact_link_input").val(window.location.href);
		if (multix_displayed == true) {
			if (multix_offset_position < multix_offset) {
				jQuery("#multix").fadeOut(300);
				multix_displayed = false;
				if (multix_box_displayed) {
					var multix_box_id = jQuery(multix_box_displayed).attr("href").substr(1);
					jQuery("#"+multix_box_id).fadeOut(300);
				}
			}
		} else {
			if (multix_offset_position >= multix_offset) {
				jQuery("#multix").fadeIn(300);
				multix_displayed = true;
				if (multix_box_displayed) {
					var multix_box_id = jQuery(multix_box_displayed).attr("href").substr(1);
					jQuery("#"+multix_box_id).fadeIn(300);
				}
			}
		}
	});
	jQuery(".multix_boxedlink").click(function() {
		multix_close_displayed(false);
		if (multix_box_displayed != this) {
			multix_box_displayed = this;
			var multix_box_right = jQuery(window).width() - jQuery(this).offset().left - jQuery(this).outerWidth();
			var multix_box_id = jQuery(this).attr("href").substr(1);
			jQuery(this).addClass("multix_hovered");
			if (jQuery("#"+multix_box_id).outerWidth() + multix_box_right > jQuery(window).width() - jQuery("#multix").offset().left) {
				multix_box_right = jQuery(window).width() - jQuery("#multix").offset().left - jQuery("#"+multix_box_id).outerWidth();
			}
			jQuery("#"+multix_box_id).css("right", multix_box_right);
			var multix_height = jQuery("#multix").height();
			if (multix_height < multix_height_value) multix_height = multix_height_value;
			jQuery("#"+multix_box_id).css('display', 'block');
			if (multix_position == 'bottom') jQuery("#"+multix_box_id).stop().animate({bottom: multix_height}, 300);
			else jQuery("#"+multix_box_id).stop().animate({top: multix_height}, 300);
		} else multix_box_displayed = null;
		return false;
	});
	jQuery(".multix_menubar a").hover(function() {
		multix_close_displayed(true);
	});
	jQuery(".multix_box_close").click(function() {
		multix_close_displayed(true);
	});
	jQuery(window).resize(function() {
		jQuery(".multix_box_container").css("max-width", jQuery(window).width()-20);
	//	multix_close_displayed(true);
	});
	jQuery("#multix_scrollup").click(function() {
		multix_close_displayed(true);
		jQuery('html, body').stop().animate({scrollTop: 0}, 500);
	});
});

function multix_close_displayed(setnull) {
	if (multix_box_displayed) {
		jQuery(".multix_redborder").removeClass("multix_redborder");
		jQuery(multix_box_displayed).removeClass("multix_hovered");
		var multix_box_id = jQuery(multix_box_displayed).attr("href").substr(1);
		var multix_height = jQuery("#"+multix_box_id).height();
		if (multix_height < 10) multix_height = 640;
		if (multix_position == "bottom") {
			jQuery("#"+multix_box_id).animate(
				{bottom: -multix_height-40}, 
				300,
				function(multix_box_id) {
					jQuery(this).css('display', 'none');
				}
			);
		} else {
			jQuery("#"+multix_box_id).animate(
				{top: -multix_height-40}, 
				300,
				function(multix_box_id) {
					jQuery(this).css('display', 'none');
				}
			);
		}
		if (setnull) multix_box_displayed = null;
		jQuery(".multix_infobox").slideUp(300);
	}
}

function multix_contact() {
	var multix_name = jQuery("#multix_contact_name").val();
	var multix_email = jQuery("#multix_contact_email").val();
	var multix_message = jQuery("#multix_contact_message").val();
	var recaptcha_challenge_field = jQuery("#recaptcha_challenge_field").val();
	var recaptcha_response_field = jQuery("#recaptcha_response_field").val();
	var data = {
		name: multix_name, 
		email: multix_email,
		recaptcha_response_field: recaptcha_response_field,
		recaptcha_challenge_field: recaptcha_challenge_field,
		message: multix_message, 
		action: "multix_contact_submit"};
	jQuery("#multix_contact_name").removeClass("multix_redborder");
	jQuery("#multix_contact_email").removeClass("multix_redborder");
	jQuery("#recaptcha_response_field").removeClass("multix_redborder");
	jQuery("#multix_contact_message").removeClass("multix_redborder");
	jQuery("#multix_contact_submit").attr("disabled","disabled");
	jQuery("#multix_contact_spinner").css("visibility","visible");
	jQuery.post(multix_ajaxhandler, data, function(data) {
		jQuery("#multix_contact_submit").removeAttr("disabled");
		jQuery("#multix_contact_spinner").css("visibility","hidden");
		if(data.match("ERROR") != null) {
			if(data.match("name") != null) jQuery("#multix_contact_name").addClass("multix_redborder");
			if(data.match("email") != null) jQuery("#multix_contact_email").addClass("multix_redborder");
			if(data.match("message") != null) jQuery("#multix_contact_message").addClass("multix_redborder");
			if(data.match("recaptcha_response_field") != null) jQuery("#recaptcha_response_field").addClass("multix_redborder");
		} else if(data.match("INTERNAL") != null) {
			alert("Internal error occured!");
		} else {
			jQuery("#multix_contact_infobox").slideDown(300);
			var form_top = -jQuery("#multix_contact_form").height()+jQuery("#multix").height()-20;
			if (multix_position == "bottom") jQuery("#multix_contact_form_container").animate({bottom: form_top}, 300);
			else jQuery("#multix_contact_form_container").animate({top: form_top}, 300);
		}
	});
}

function multix_subscribe() {
	var multix_name = jQuery("#multix_subscribe_name").val();
	if (!multix_name) multix_name = "";
	var multix_email = jQuery("#multix_subscribe_email").val();
	var data = {name: multix_name, email: multix_email, action: "multix_subscribe_submit"};
	jQuery("#multix_subscribe_name").removeClass("multix_redborder");
	jQuery("#multix_subscribe_email").removeClass("multix_redborder");
	jQuery("#multix_subscribe_submit").attr("disabled","disabled");
	jQuery("#multix_subscribe_spinner").css("visibility","visible");
	jQuery.post(multix_ajaxhandler, data, function(data) {
		jQuery("#multix_subscribe_submit").removeAttr("disabled");
		jQuery("#multix_subscribe_spinner").css("visibility","hidden");
		if(data.match("ERROR") != null) {
			if(data.match("name") != null) jQuery("#multix_subscribe_name").addClass("multix_redborder");
			if(data.match("email") != null) jQuery("#multix_subscribe_email").addClass("multix_redborder");
		} else if(data.match("INTERNAL") != null) {
			alert("Internal error occured!");
		} else {
			jQuery("#multix_subscribe_infobox").slideDown(300);
			var form_top = -jQuery("#multix_subscribe_form").height()+jQuery("#multix").height()-20;
			if (multix_position == "bottom") jQuery("#multix_subscribe_container").animate({bottom: form_top}, 300);
			else jQuery("#multix_subscribe_container").animate({top: form_top}, 300);
		}
	});
}
