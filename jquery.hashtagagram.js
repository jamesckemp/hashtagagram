(function($){
$.fn.hashtagagram = function(options){
	var defaults = {
		client_id:'000000000000000000000000',
		username: false,
		thumb_dimension:110,
		success:ProcessData,
		load_cookie_result:LoadResultsFromCookie,
		tag_name: 'babes',
		count: 6,
		enable_cache: false,
		cache_duration: 1,
		cookie_name: 'CachedInstagramPhotos',
		show_likes: true
	};
	
	var self = $(this);
	var options = $.extend(defaults,options);
	defaults.cookie_name = defaults.cookie_name+'_'+defaults.tag_name;
	
	var url = 'https://api.instagram.com/v1/tags/'+defaults.tag_name+'/media/recent?client_id='+defaults.client_id;
	
	var init = function(){
		if(defaults.enable_cache){
			var savedResponse = readCookie(defaults.cookie_name);
			if(savedResponse != null && savedResponse != ''){
				defaults.load_cookie_result(savedResponse);
				return false;
			}
		}
		
		LoadResults();
	};
	
	var LoadResults = function(){
		$.ajax({
			dataType:'jsonp',
			url:url,
			success:function(response){
				defaults.success(response);
			}
		});
	
	};
	function LoadResultsFromCookie(savedResponse){
		self.append(savedResponse);
	};
	function ProcessData(response){
		if(response != null){
			var ul = $('<ul class="fourGrid"/>');
			
			$(response.data).each(function(index,obj){
				if(index == defaults.count)
					return false;
				
				// console.log(obj);
				
				if(defaults.username == 1 || defaults.username == obj.user.username) {
					console.log(obj.user);
					var link = $('<a/>'), image = $('<img/>'), li = $('<li/>');
					image.attr({'src': obj.images.low_resolution.url,'width':defaults.thumb_dimension,'height': defaults.thumb_dimension});
					link.attr('href',obj.link);
					link.attr('target','_blank');
					image.appendTo(link);
					link.appendTo(li);
					
					if(defaults.show_likes && obj.likes.count)
					{
						var userLikes = $('<span class="instaLikes"><i class="icon-heart"></i> '+obj.likes.count+'</span>');
						userLikes.appendTo(li);
					}
					
					if(defaults.username == 1){
						var userInfo = $('<a class="instaUser" href="http://instagram.com/'+obj.user.username+'" target="_blank"><img src="'+obj.user.profile_picture+'"> '+obj.user.username+'</div></a>');
						userInfo.appendTo(li);
					}
					ul.append(li);
				}
			});
			
			self.append(ul);
			
			if(defaults.enable_cache){
				createCookie(defaults.cookie_name,self.html(),defaults.cache_duration);
			}
		}
	};
	function createCookie(name,value,days) {
		if (days > 0) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			var expires = "; expires="+date.toGMTString();
		}
		else var expires = "";
		document.cookie = name+"="+value+expires+"; path=/";
	};
	function readCookie(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
	};
	function eraseCookie(name) {
		createCookie(name,"",-1);
	};
	init();
	
}})(jQuery);
