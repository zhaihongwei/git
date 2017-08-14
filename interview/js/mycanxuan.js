var userid = 0;
$('#canxuan').click(function() {
	//	console.log(encodeURI($('#strong').val()))
	
	$.ajax({
		type: "post",
		url: "http://47.92.37.168/php/index.php?C=Login&M=vote",
		async: true,
		dataType: "json",
		data: {
			'username': $('#cx_name').val(),
			'introduce': $('#cx_grjj').val(),
			'strong': $('#cx_jstc').val()
		},
		success: function(data) {
			console.log(data)
			if(data.code == 200) {
				alert("参选成功");
				//$('#btn_canxuan').click()
				$('.sctx')[0].style.display='block';
				$('.myform')[0].style.display='none';
//				location.reload();
				userid=data.data;
//				alert(userid);
			}
		}
	});
	return false;
})

	$('#file2').change(function() {
					if(ckPhoto(this)){
					//获取file文件
					var domFile = $(this)[0].files[0];
//					console.log($(this)[0].files[0]);
					//创建FormData对象  用来封装二进制文件
					var formData = new FormData();
					//追加file 对象  
					formData.append('file', domFile);
					//追加登陆者id
					formData.append('id', userid);//id  对应的是参选面试成功返回的id
						
					$.ajax({
						url: 'http://47.92.37.168/php/index.php?C=Login&M=sendPic',
						type: "POST",
						dataType:'json',
						data: formData,
						processData: false, // tell jQuery not to process the data  
						contentType: false, // tell jQuery not to set contentType  
						
						success: function(data) {
							if(data.code==200){
								alert('上传头像成功');
								location.reload();
							}
						}
					})
				}
			})
			//判断照片大小,及名称后缀
		function ckPhoto(obj) {
			console.log(obj.value);//C:\fakepath\2.png
			photoExt = obj.value.substr(obj.value.lastIndexOf(".")).toLowerCase(); //获得文件后缀名
			if(photoExt != '.jpg' && photoExt != '.png' && photoExt != '.jpeg') {
				alert("请上传后缀名为jpg或jpg或jpeg的照片!");
				return false;
			}
			var fileSize = 0;
			//以下是兼容ie低版本 （本项目不兼容ie无须考虑）
			//  var isIE = /msie/i.test(navigator.userAgent) && !window.opera;            
			//  if (isIE && !obj.files) {          
			//       var filePath = obj.value;            
			//       var fileSystem = new ActiveXObject("Scripting.FileSystemObject");   
			//       var file = fileSystem.GetFile (filePath);               
			//       fileSize = file.Size;         
			//  }else {  
			fileSize = obj.files[0].size;//136523B
			//  } 
			fileSize = Math.round(fileSize / 1024 * 100) / 100;
			if(fileSize >= 1024) {
				alert("照片最大尺寸为1MB，请重新上传!");
				return false;
			}
			return true;
		}


//获得所有参加面试的 人
$.ajax({
	type: "get",
	url: "http://47.92.37.168/php/index.php?C=Login&M=voteList",
	async: true,
	dataType: "json",
	success: function(data) {
		//			console.log(data);
		$('#cxr_zhanshi').empty()
		var html = '';
		var img ='';
		for(var i = 0; i < data.data.length; i++) {
			if(data.data[i].img!=null){
				img='http://47.92.37.168/php/'+data.data[i].img;
			}else{
				img='images/img1.png';
			}
			html += '<div class="col-md-4 profile widget-shadow content">' +
				'<h4 class="title3">参选人</h4>' +
				'<div class="profile-top">' +
				'<img src="'+img+'" alt="" style="width:30%;height:30%;">' +
				'<h4>' + data.data[i].username + '</h4>' +
				'<h5>收到' + data.data[i].number + '个offer</h5>' +
				'</div>' +
				'<div class="profile-text">' +
				'<h4>个人简介：</h4>' +
				'<p class="gun">' + data.data[i].introduce + '</p>' +
				'<div style=""></div>' +
				'<h4>技术特长:</h4>' +
				'<p class="gun">' + data.data[i].strong + '</p>' +
				'</div>' +
				'<div class="profile-btm conter-jianyi">' +
				'<button type="button" class="btn btn-primary button jianyi" data-toggle="modal" data-target=".bs" thisid="' + data.data[i].id + '">建议</button>' +
				'<button type="button" class="btn btn-primary button luyong" thisid="' + data.data[i].id + '">录用</button>' +
				'</div>' +
				'</div>';
		}
		$('#cxr_zhanshi').append(html);

	}
});

$('#cxr_zhanshi').delegate('.luyong', 'click', function() {
	var id = this.getAttribute('thisid');
	if(localStorage.id) {
		var arr = localStorage.id.split(',');

		if(arr.indexOf(id) == -1) {
//			alert('没评论过')
//			localStorage.id += ',' + id;
			$.ajax({
				type: "post",
				url: "http://47.92.37.168/php/index.php?C=Login&M=addVote",
				async: true,
				dataType: 'json',
				data: {
					'id': id
				},
	
				success: function(data) {
					alert('评论成功');
					localStorage.id += ',' + id;
				}
			});
			
		} else {
			alert('您已经评论过');

		}
	} else {
//		localStorage.id = 0;
				$.ajax({
				type: "post",
				url: "http://47.92.37.168/php/index.php?C=Login&M=addVote",
				async: true,
				dataType: 'json',
				data: {
					'id': id
				},
	
				success: function(data) {
					alert('offer 已经发出！');
					localStorage.id =  id;
				}
			});
	}
	return false;
})

$('#jianyi_tijiao').click(function() {
	var _this = this;
	$.ajax({
		type: "post",
		url: "http://47.92.37.168/php/index.php?C=Login&M=suggest",
		async: true,
		dataType: 'json',
		data: {
			'suggest': $('#jianyi_textarea').val(),
			'id': jyid
		},
		success: function(data) {
			if(data.code == 200) {
				alert('感谢您的评价，我将再接再厉!');
				$('#myModal').modal('hide');
			}
		}
	});
	return false;
})

var jyid = '';
$('#cxr_zhanshi').delegate('.jianyi', 'click', function() {
	jyid = this.parentElement.previousElementSibling.previousElementSibling.children[1].innerHTML;
});
$('#findmy').click(function() {
	$('#ul_modal').empty();
	$.ajax({
		type: "post",
		url: "http://47.92.37.168/php/index.php?C=Login&M=findSuggest",
		async: true,
		dataType: 'json',
		data: {
			'id': $('#findtext').val() //查询密码  （用户注册面试后返回的用户id）
		},
		success: function(data) {
			if(data.code == 200) {
				var d = data.data;
				var html = '';
				for(var i = 0; i < d.length; i++) {
					html += '<li>' + d[i].suggest + '</li>';
				}
				$('#ul_modal').append(html);
			}

		}
	});
})
$('#findUser').click(function(){
	
		$.ajax({
				type: "post",
				url: "http://47.92.37.168/php/index.php?C=Login&M=findUser",
				async: true,
				dataType:'json',
				data: {
					'username': $('#findu').val()
				
				},
				success: function(data) {
//					console.log(data);
						$('#cxr_zhanshi').empty()
		var html = '<div class="col-md-4 profile widget-shadow content">' +
				'<h4 class="title3">参选人</h4>' +
				'<div class="profile-top">' +
				'<img src="images/img1.png" alt="">' +
				'<h4>' + data.data[0].username + '</h4>' +
				'<h5>' + data.data[0].number + '</h5>' +
				'</div>' +
				'<div class="profile-text">' +
				'<h4>个人简介：</h4>' +
				'<p class="gun">' + data.data[0].introduce + '</p>' +
				'<div style=""></div>' +
				'<h4>技术特长:</h4>' +
				'<p class="gun">' + data.data[0].strong + '</p>' +
				'</div>' +
				'<div class="profile-btm conter-jianyi">' +
				'<button type="button" class="btn btn-primary button jianyi" data-toggle="modal" data-target=".bs" thisid="' + data.data[0].id + '">建议</button>' +
				'<button type="button" class="btn btn-primary button luyong" thisid="' + data.data[0].id + '">录用</button>' +
				'</div>' +
				'</div>';
		
		$('#cxr_zhanshi').append(html);
				}
		});
		return false;
})
