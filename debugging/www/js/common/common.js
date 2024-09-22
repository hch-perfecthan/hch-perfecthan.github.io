/**
 * @파일명 : common.js
 * @작성자 : 한창훈
 * @생성일 : 2023. 6. 28.
 * @설명 : 공통 함수 정의
 */

/**
 * 공통 UI 관련
 */
var CommonUI = {
	
	// 스크립트 동적 로딩
	loadScript: function(src, callback) {
	    var script = document.createElement('script');
	    script.type = 'text/javascript';
	    if (script.readyState) { // IE < 11
	        script.onreadystatechange = function() {
	            if (script.readyState === 'loaded' || script.readyState === 'complete') {
	                script.onreadystatechange = null;
					if (!!callback) {
	                	callback();
					}
	            }
	        }
	    } else { // Others
	        script.onload = function () {
				if (!!callback) {
                	callback();
				}
	        }
	    }
	    script.src = src;//script.setAttribute('src', src);
	    document.body.appendChild(script);//document.querySelector('body').appendChild(script);
	},
	
	// 스크립트 삭제
	removeScript: function(src) {
    	$('script').each(function(index, item) {
    		if (src == $(item).attr('src')) {
    			$(this).remove();
    			return false;
    		}
    	});
	}, 

	// 화면 상단으로 이동
	scrollTop: function() {
		$('html, body').finish().animate({scrollTop: 0}, 0);
	}
	
}


/**
 * 공통 유틸 관련
 */
var CommonUtil = {
	
	// 오브젝트 값의 존재 여부
	isEmpty: function(obj = null) {
		if (typeof obj == 'undefined' || obj == null || obj == undefined) {
			return true;
		}
		if (typeof obj == 'string') {
			if (obj.length === 0 || obj == 'null' || obj == 'undefined') { 
		        return true;
		    }
		}
		if (typeof obj == 'object') {
			if (Object.keys(obj).length === 0)  {
		        return true;
		    }
		}
		if (Array.isArray(obj)) {
		    if (obj.length == 0) {
		        return true;
		    }
		}
	    return false;
	},
	
	// 랜덤 문자열 생성
	generateRandomString: function(length) {
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let randomString = '';
		for (let i = 0; i < length; i++) {
			const randomIndex = Math.floor(Math.random() * characters.length);
			randomString += characters.charAt(randomIndex);
		}
		return randomString;
	},

	getDeviceType: function() {
		let deviceType = '-';
		let userAgent = navigator.userAgent;
		if (/Android/i.test(userAgent)) {
			deviceType = 'AOS';
		} else if (/iPhone|iPad|iPod/i.test(userAgent)) {
			deviceType = 'iOS';
		}
		return deviceType;
	},
	
	// 네이티브 브라우져 여부
	isNative: function() {
		return /Native/i.test(navigator.userAgent);
	}
	
}

/**
 * 문자열 공백 제거
 */
String.prototype.trim = function() {
	let str = this.replace(/^\s\s*/, '');
	str = str.replace(/\s\s*$/, '');
	return str;
};

/**
 * 문자열/숫자 프로토타입으로 입력 길이만큼 앞에 0을 채운 문자열 반환
 * https://blogpack.tistory.com/600
 */
String.prototype.fillZero = function(width) {
    return this.length >= width ? this : new Array(width - this.length + 1).join('0') + this; // 남는 길이만큼 0으로 채움
}
