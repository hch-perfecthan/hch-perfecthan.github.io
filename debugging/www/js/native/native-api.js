/**
 * @파일명 : native-api.js
 * @작성자 : 한창훈
 * @생성일 : 2023. 9. 7.
 * @설명 : 네이티브 연동 인터페이스
 */


/** ---- 네이티브 연동 함수 (앱에서 호출) : START ---- */

/**
 * 자바스크립트 난독화
 * https://www.lddgo.net/en/encrypt/js
 * https://obfuscator.io/
 */
var Native = {

	// (웹페이지 로드 후) 네이티브 연동 준비 완료 시 호출
	onReady: function() {
        console.log('Native onReady function called');
        // 함수 존재 여부를 체크하고 호출
        if (typeof onReady === 'function') {
            onReady();
        } else {
            console.log('onReady function does not exist');
        }
        Native.onResume();
	},
	
	// 안드로이드 백 버튼 클릭 시 호출
	onBack: function() {
        console.log('Native onBack function called');
        // 함수 존재 여부를 체크하고 호출
        if (typeof onBack === 'function') {
            return onBack();
        } else {
            console.log('onBack function does not exist');
        }
        return false;
	},
	
	// 백그라운드에서 포그라운드로 이동 시 호출
	onResume: function() {
        console.log('Native onResume function called');
        // 함수 존재 여부를 체크하고 호출
        if (typeof onResume === 'function') {
            onResume();
        } else {
            console.log('onResume function does not exist');
        }
	},
	
	// Pull to refresh 할 경우 호출
	onRefresh: function() {
        console.log('Native onRefresh function called');
        // 함수 존재 여부를 체크하고 호출
        if (typeof onRefresh === 'function') {
            onRefresh();
        } else {
            console.log('onRefresh function does not exist');
        }
	},
	
	// 포그라운드에서 백그라운드로 이동 시 호출 
	onPause: function() {
        console.log('Native onPause function called');
        // 함수 존재 여부를 체크하고 호출
        if (typeof onPause === 'function') {
            onPause();
        } else {
            console.log('onPause function does not exist');
        }
	},
    
    // 푸시 알림 수신 함수
    onFCM: function(obj) {
        console.log('Native onFCM function called');
        // 함수 존재 여부를 체크하고 호출
        if (typeof onFCM === 'function') {
            return onFCM(obj);
        } else {
            console.log('onFCM function does not exist');
        }
        return false;
    },
    
    // hybrid 스키마에 의한 앱 실행 시 URL 수신 함수
    onURL: function(url) {
        console.log('Native onURL function called');
        // 함수 존재 여부를 체크하고 호출
        if (typeof onURL === 'function') {
            return onURL(url);
        } else {
            console.log('onURL function does not exist');
        }
        return false;
    },

	// 파일 다운로드나 업로드 시 진행률 표시할 경우 호출
	onProgress: function(percent, length, total) {
        console.log('Native onProgress function called');
        // 함수 존재 여부를 체크하고 호출
        if (typeof onProgress === 'function') {
            //onProgress(percent, length, total);
        } else {
            console.log('onProgress function does not exist');
        }
        if (!!Native.netowrk.static.callback) {
            Native.netowrk.static.callback(percent, length, total);
        }
	},

	// 현재 위치 정보를 가져올 경우 호출
	onLocation: function(obj) {
        console.log('Native onLocation function called');
        // 함수 존재 여부를 체크하고 호출
        if (typeof onLocation === 'function') {
            //onLocation(obj);
        } else {
            console.log('onLocation function does not exist');
        }
        if (!!Native.location.static.callback) {
            Native.location.static.callback(obj);
        }
	},
    
    param: function(obj) {
        const queryString = Object.keys(obj)
        .map(key => {
            const value = obj[key];
            if (Array.isArray(value)) {
                return value.map(v => encodeURIComponent(key) + '=' + encodeURIComponent(v)).join('&');
            }
            return encodeURIComponent(key) + '=' + encodeURIComponent(value);
        })
        .join('&');
        return queryString;
    }
	
}

/** ---- 네이티브 연동 함수 (앱에서 호출) : END ---- */


/** ---- 네이티브 연동 함수 (웹에서 호출) : START ---- */

// 화면 설정 관련
Native.settings = {

    // 앱 설정 (화면 영역 설정, 상태바 글자색/배경색 설정)
    app: function(options = {}) {
        options = options ?? {}
        let fillTopArea = options.fillTopArea ?? false
        let fillBtmArea = options.fillBtmArea ?? false
        let useDarkSystemUI = options.useDarkSystemUI ?? false
        Native.Api.call('app_settings', [fillTopArea, fillBtmArea, useDarkSystemUI]);
    },

    // 웹 설정 (주소창 보이기/숨기기, 탭 컨트롤 보이기/숨기기)
    web: function(options = {}) {
        options = options ?? {}
        let showAdrCtrl = options.showAdrCtrl ?? true
        let showTabCtrl = options.showTabCtrl ?? true
        Native.Api.call('web_settings', [showAdrCtrl, showTabCtrl]);
    },

}

// 정보 조회 관련
Native.info = {

    // 디바이스 정보 가져오기
    device: function(callback) {
        Native.Api.call('device_info', null, callback);
    },

    // 앱 정보 가져오기
    app: function(callback) {
        Native.Api.call('app_info', null, callback);
    },

}

// 권한 관련
Native.permission = {

    // 푸시 알림 권한 체크 - isRequest가 true일 경우는 권한 요청까지 진행
    check: function(options = {}, callback) {
        options = options ?? {}
        if (options.permissionType != null) {
            Native.Api.call('check_permission', [options.permissionType, options.request], callback);
        }
    },

    // 푸시 알림 권한 설정 화면으로 이동
    moveSettings: function(permissionType) {
        Native.Api.call('permission_settings', permissionType);
    },

}

// Preferences 관련
Native.preference = {

    // 문자열 저장하기
    saveString: function(key, value) {
        Native.Api.call('save_string', [key, value]);
    },

    // 문자열 가져오기
    loadString: function(key, callback) {
        Native.Api.call('load_string', key, callback);
    },

}

// 네이티브 UI 관련
Native.ui = {

    // 스플래시 보이기
    showSplash: function(isShow = true, duration = 0) {
        Native.Api.call('show_splash', [isShow, duration]);
    },

    // 스플래시 숨기기
    hideSplash: function(duration = 0) {
        Native.Api.call('hide_splash', duration);
    },

    // 로딩 띄우기
    showLoading: function(isShow = true) {
        Native.Api.call('show_loading', isShow);
    },

    // 로딩 숨기기
    hideLoading: function() {
        Native.Api.call('hide_loading');
    },

    // Pull to refresh 활성화/비활성화
    pullToRefresh: function(isEnabled) {
        Native.Api.call('pull_to_refresh', isEnabled);
    },

    // 알림창 띄우기
    showAlert: function(options = {}, callback) {
        options = options ?? {}
        Native.Api.call('alert', [options.title, options.msg, options.btnText], callback);
    },

    // 확인창 띄우기
    showConfirm: function(options = {}, callback) {
        options = options ?? {}
        Native.Api.call('confirm', [options.title, options.msg, options.btnConfirm, options.btnCancel], callback);
    },

    // 프롬프트창 띄우기
    showPrompt: function(options = {}, callback) {
        options = options ?? {}
        Native.Api.call('prompt', [options.title, options.msg, options.text, options.btnConfirm, options.btnCancel], callback);
    },

    // 토스트 띄우기
    showToast: function(msg) {
        Native.Api.call('toast', msg);
    },

    // 키보드 숨기기
    hideKeyboard: function() {
        Native.Api.call('hide_keyboard');
    },

}

// 네트워크 통신 관련
Native.netowrk = {

	static: {
		callback: undefined
	},

    // 네트워크 통신
    request: function(options = {}, callback) {
        options = options ?? {}
        let url = options.url
        let method = options.method ?? "GET"
        let headers = options.headers ?? {}
        let params = options.params ?? {}
        let isJson = options.isJson ?? false
        Native.Api.call('ajax', [url, method, JSON.stringify(headers), JSON.stringify(params), isJson], callback);
    },

    // 파일 다운로드
    download: function(options = {}, callback, progressCallback) {
        options = options ?? {}
        let url = options.url
        let method = options.method ?? "GET"
        let headers = options.headers ?? {}
        let params = options.params ?? {}
        let isJson = options.isJson ?? false
        let useTempDir = options.useTempDir ?? true
        let ext = options.ext
        Native.netowrk.static.callback = function(percent, length, total) {
            if (!!progressCallback) {
                progressCallback(percent, length, total)
            }
            if (percent == 100 && length == total) {
                Native.netowrk.static.callback = undefined
            }
        }
        Native.Api.call('file_download', [url, method, JSON.stringify(headers), JSON.stringify(params), isJson, useTempDir, ext], callback);
    },

}

// 앱 관련
Native.app = {

    // 외부 웹브라우저 열기
    webBrowser: function(url) {
        Native.Api.call('web_browser', url);
    },

    // 내부 웹브라우저 열기
    appBrowser: function(url) {
        Native.Api.call('app_browser', url);
    },

    // 서브 웹뷰 열기
    webViewer: function(url) {
        Native.Api.call('web_viewer', url);
    },

    // VLC 플레이어 열기
    vlcPlayer: function(url) {
        Native.Api.call('vlc_player', url);
    },

    // (서브 화면에서 호출 시) 메인 화면으로 이동 (URL 존재 시 메인 화면에서 URL 이동)
    main: function(url) {
        Native.Api.call('main', url);
    },

    // (서브 화면에서 호출 시) 현재 화면 종료 (메인 화면일 경우 동작 X)
    back: function() {
        Native.Api.call('back');
    },

    // (서브 화면에서 호출 시) 현재 화면 종료 (메인 화면일 경우 동작 X)
    close: function() {
        Native.Api.call('close');
    },

    // 파일 경로 또는 URL 열기
    fileViewer: function(url, callback) {
        Native.Api.call('file_viewer', url, callback);
    },

    // 파일 공유
    fileShare: function(filePath, callback) {
        Native.Api.call('file_share', filePath, callback);
    },

    // 링크 URL 공유
    linkShare: function(url, callback) {
        Native.Api.call('link_share', url, callback);
    },

    // 앱 실행 (미설치 시 앱 스토어 이동)
    launch: function(options = {}) {
        options = options ?? {}
        Native.Api.call('launch', [options.scheme, options.market, options.finish]);
    },

    // 화면 회전
    orientation: function(orientation) {
        Native.Api.call('orientation', orientation);
    },

    // 쿠키 삭제 (모든 쿠키, 도메인 쿠키, 특정 쿠키)
    removeCookies: function(callback, options = {}) {
        options = options ?? {}
        Native.Api.call('remove_cookies', [options.domain, options.key], callback);
    },

    // 푸시 토큰 삭제 후 재발급 (DB 푸시 토큰 업데이트 필요)
    refreshToken: function(callback) {
        Native.Api.call('refresh_token', null, callback);
    },

    // 로그아웃 (푸시 토큰 삭제 후 재발급) - (재로그인 시 DB 푸시 토큰 업데이트 필요)
    logout: function(callback) {
        Native.Api.call('logout', null, callback);
    },

    // 앱 종료
    finish: function() {
        Native.Api.call('finish');
    },

}

// 바코드 관련
Native.barcode = {

    // 바코드 스캔 및 결과값 가져오기
    scanner: function(callback, options = {}) {
        options = options ?? {}
        Native.Api.call('barcode_scanner', [JSON.stringify(options)], callback);
    },

}

// 위치 관련
Native.location = {

	static: {
		callback: undefined
	},

    // GPS ON/OFF 여부
    isGPSEnabled: function(callback) {
        Native.Api.call('gps_enabled', null, callback);
    },

    // GPS 설정 화면으로 이동
    moveGPSSettings: function(callback) {
        Native.Api.call('gps_settings', null, callback);
    },

    // 내 위치 정보 가져오기
    myLocation: function(callback, options = {}) {
        options = options ?? {}
        let repeat = options.repeat ?? false
        if (repeat) {
            Native.location.static.callback = function(obj) {
                if (!!callback) {
                    callback(obj);
                }
            }
        } else {
            Native.location.static.callback = undefined
        }
        Native.Api.call('my_location', [repeat], callback);
    },

    // 두 위치 간 방위/거리 계산
    calculate: function(loc1 = {}, loc2 = {}, callback) {
        loc1 = loc1 ?? {}
        loc2 = loc2 ?? {}
        Native.Api.call('location_calculate', [loc1.latitude, loc1.longitude, loc2.latitude, loc2.longitude], callback);
    },

    // 위치 정보 가져오기 종료
    finish: function() {
        Native.location.static.callback = undefined
        Native.Api.call('location_finish');
    },

}

/** ---- 네이티브 연동 함수 (웹에서 호출) : END ---- */


/** ---- 네이티브 API 호출 함수 (웹/앱에서 호출) : START ---- */

Native.Api = {

	static: {
		resolve: undefined
	},

	call: function(command, params = [], callback) {
		let obj = {}
		obj.command = command;
		params = params ?? [];
		if (!Array.isArray(params)) {
			params = [params];
		}
		obj.params = JSON.stringify(params);
        let isNativeSync = !!callback;
        if (isNativeSync) {
			obj.callback = 'Native.Api.callback';
		}
		let query = Native.param(obj);//$.param(obj);
	    let promise = new Promise((resolve, reject) => {
            var href = 'hybrid://native_api?' + query;
			console.log(href);
            var iframe = document.createElement('iframe');
            iframe.src = href;
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('border', '0');
            iframe.setAttribute('width', '0');
            iframe.setAttribute('height', '0');
            document.body.appendChild(iframe);
            setTimeout(function() {
                document.body.removeChild(iframe);
            }, 100);
            if (isNativeSync) {
                Native.Api.static.resolve = resolve;
            } else {
                resolve();
            }
        });
        promise.then((args) => {
			if (!!callback) {
				callback(...args);
			}
		});
		return promise;
	},

	callback: function(...args) {
		let resolve = Native.Api.static.resolve;
		if (!!resolve) {
			resolve(args);
			Native.Api.static.resolve = undefined;
		}
	},

}

Native.onReady();

/** ---- 네이티브 API 호출 함수 (웹/앱에서 호출) : END ---- */
