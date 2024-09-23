/**
 * @파일명 : native-example.js
 * @작성자 : 한창훈
 * @생성일 : 2024. 7. 1.
 * @설명 : 네이티브 연동 인터페이스
 */


/** ---- 네이티브 연동 함수 (앱에서 호출) : START ---- */

function onReady() {
    console.log('네이티브 연동 준비 완료');//alert('네이티브 연동 준비 완료');
    // 디바이스 정보 조회 (콜백 방식)
    Native.info.device(function(obj) {
        obj = obj ?? {}
        if (obj.darkMode ?? false) {
            // 다크모드 스타일 적용
            document.body.classList.add('dark-mode');
            document.body.style.backgroundColor = '#000';
            document.body.style.color = '#fff';
        } else {
            document.body.classList.remove('dark-mode');
            document.body.style.backgroundColor = '#fff';
            document.body.style.color = '#000';
        }
        // 스플래시 화면 숨기기
        Native.ui.hideSplash(500);
    });
}

function onResume() {
    console.log('포그라운드 진입');//alert('포그라운드 진입');
}

function onRefresh() {
    setTimeout(function() {
        console.log('새로고침 실행');//alert('새로고침 실행');
    }, 1000);
    //window.location.reload();
}

function onBack() {
    console.log("백 버튼 액션 (Only Android)");//alert('백 버튼 액션');
    let isLastPage = false;
    if (isLastPage) {
        if (confirm('앱을 종료하시겠습니까?')) {
            // 앱 종료
            Native.app.finish();
            return true; // onBack 함수에서 특정 액션 처리 시 백버튼 기본 액션이 함께 동작되지 않도록할 경우, 리턴값 true 설정
        }
    }
    return false; // 리턴값 false 설정일 경우, Android 백버튼 기본 액션 (뒤로가기) 처리 동작
}

function onPause() {
    console.log('백그라운드 진입');//alert('백그라운드 진입');
}

// 푸시 알림 수신 함수
function onFCM(obj) {
    let isLoggedIn = true; // 로그인 여부
    if (isLoggedIn) {
        if (obj != null) {
            let msg = `푸시 데이터 수신: ${JSON.stringify(obj)}`;
            console.log(msg);
            console.log(`제목: ${obj.title}\n내용: ${obj.body}\n데이터: ${obj.args}`);
        }
        return true; // 푸시 데이터 처리할 경우, 반드시 리턴값 true 설정
    }
    // 푸시 데이터를 처리하지 않을 경우, 다음 페이지가 로드될 때, 다시 onFCM 함수가 호출된다.
    return false; // 푸시 데이터를 처리하지 않을 경우, 리턴값 false 설정 (또는 onFCM 함수를 선언하지 않으면 된다.)
 }

// 외부 앱으로부터의 호출 (스키마 호출) 에 의한 앱 실행 시 스키마 URL 수신 함수
function onURL(url) {
    let isLoggedIn = true; // 로그인 여부
    if (isLoggedIn) {
        let msg = `스키마 URL 수신: ${url}`;
        console.log(msg);
        alert(msg);
        // URL 객체 생성
        const obj = new URL(url);
        const schema = obj.protocol.replace(/:$/, '');;
        const host = obj.host;
        const queryParams = new URLSearchParams(obj.search);
        const params = {};
        queryParams.forEach((value, key) => {
            params[key] = value;
        });
        console.log(`스키마: ${schema}\n호스트: ${host}\n파라미터: ${JSON.stringify(params)}`);
        return true; // 스키마 URL 처리할 경우, 반드시 리턴값 true 설정
    }
    // 스키마 URL을 처리하지 않을 경우, 다음 페이지가 로드될 때, 다시 onURL 함수가 호출된다.
    return false; // 스키마 URL을 처리하지 않을 경우, 리턴값 false 설정 (또는 onURL 함수를 선언하지 않으면 된다.)
}

/** ---- 네이티브 연동 함수 (앱에서 호출) : END ---- */


$(function() {

    console.log(`UserAgent: ${navigator.userAgent}`);

})


/** ---- 네이티브 연동 함수 (웹에서 호출) : START ---- */

function onFullScreen() {
    let options = {
        fillTopArea: true,  // 기본값: false (설정 속성이 없거나 속성값이 null일 경우 무시)
        fillBtmArea: true,  // 기본값: false (설정 속성이 없거나 속성값이 null일 경우 무시)
        useDarkSystemUI: true,  // 기본값: false (설정 속성이 없거나 속성값이 null일 경우 무시)
    };
    // 앱 설정 (화면 영역 설정, 화면 회전 설정)
    Native.settings.app(options);
    setTimeout(() => {
        // 앱 설정 원복
        options.fillTopArea = false;
        options.fillBtmArea = false;
        options.useDarkSystemUI = false;
        Native.settings.app(options);
    }, 3000);
}

function onShowWebControl() {
    let options = {
        showAdrCtrl: false, // 기본값: true (설정 속성이 없거나 속성값이 null일 경우 무시)
        showTabCtrl: false  // 기본값: true (설정 속성이 없거나 속성값이 null일 경우 무시)
    };
    // 웹 설정 (주소창 보이기/숨기기, 탭 컨트롤 보이기/숨기기)
    Native.settings.web(options);
    setTimeout(() => {
        // 웹 설정 원복
        options.showAdrCtrl = true;
        options.showTabCtrl = true;
        Native.settings.web(options);
    }, 3000);
}

async function onDeviceInfo() {
    /* 디바이스 정보 가져오기 (콜백 방식)
    Native.info.device(function(obj) {
        console.log(JSON.stringify(obj));//alert(JSON.stringify(obj));
        alert(`모델명: ${obj.model}\n타입: ${obj.type}\nOS명: ${obj.osName}\nOS버전: ${obj.osVersion}\n화면크기: ${obj.width} X ${obj.height}\n상단 영역 높이 (상태바 높이): ${obj.insetTop}\n하단 영역 높이: ${obj.insetBtm}\n다크모드 여부: ${obj.darkMode}`);
    });*/
    // 디바이스 정보 가져오기 (동기 방식)
    let obj = await new Promise((resolve) => {
        Native.info.device(function(obj) {
            resolve(obj);
        });
    });
    console.log(JSON.stringify(obj));//alert(JSON.stringify(obj));
    alert(`모델명: ${obj.model}\n타입: ${obj.type}\nOS명: ${obj.osName}\nOS버전: ${obj.osVersion}\n화면크기: ${obj.width} X ${obj.height}\n상단 영역 (상태바) 높이: ${obj.insetTop}\n하단 영역 높이: ${obj.insetBtm}\n다크모드 여부: ${obj.darkMode}`);
}

async function onAppInfo() {
    /* 앱 정보 가져오기 (콜백 방식)
    Native.info.app(function(obj) {
        console.log(JSON.stringify(obj));//alert(JSON.stringify(obj));
        alert(`앱 아이디: ${obj.id}\n앱 이름: ${obj.name}\n앱 버전: ${obj.version}\n빌드 버전: ${obj.build}\n앱 해쉬: ${obj.hash}\n푸시 토큰: ${obj.token}`);
    });*/
    // 앱 정보 가져오기 (동기 방식)
    let obj = await new Promise((resolve) => {
        Native.info.app(function(obj) {
            resolve(obj);
        });
    });
    console.log(JSON.stringify(obj));//alert(JSON.stringify(obj));
    alert(`앱 아이디: ${obj.id}\n앱 이름: ${obj.name}\n앱 버전: ${obj.version}\n빌드 버전: ${obj.build}\n앱 해쉬: ${obj.hash}\n푸시 토큰: ${obj.token}`);
}

async function onCheckPermission() {
    let options = {
        permissionType: 'notification', // 푸시 알림 권한 체크
        request: true // 기본값: false (권한 요청까지 진행 여부)
    };
    // 권한 체크 (콜백 방식)
    Native.permission.check(options, function(hasPermission) {
        if (hasPermission) {
            alert('푸시 알림 권한 존재');
        } else {
            if (options.request) {
                alert('푸시 알림 권한이 없거나 거부된 상태');
                // 푸시 알림 권한 설정 화면으로 이동
                onPermissionSettings(options.permissionType);
            } else {
                alert('푸시 알림 권한 없음');
            }
        }
    });
    /* 권한 체크 (동기 방식)
    let hasPermission = await new Promise((resolve) => {
        Native.permission.check(options, (hasPermission) => {
            resolve(hasPermission);
        });
    });
    if (hasPermission) {
        alert('푸시 알림 권한 존재');
    } else {
        alert('푸시 알림 권한 없음');
        if (options.request) {
            alert('푸시 알림 권한이 없거나 거부된 상태');
            // 푸시 알림 권한 설정 화면으로 이동
            onPermissionSettings(options.permissionType);
        } else {
            alert('푸시 알림 권한 없음');
        }
    }*/
}

function onPermissionSettings(permissionType) {
    // permissionType 파라미터 값 (undefined 또는 null: 모든 권한, 'notification': 푸시 권한, 'camera': 카메라 권한, 'location': 위치 권한)
    // 권한 설정 화면으로 이동
    Native.permission.moveSettings(permissionType);
}

function onString() {
    let input = prompt('저장할 문자열을 입력하세요.', '기본 입력 문자열');
    // 문자열 저장하기
    Native.preference.saveString('key', input);
    // 문자열 가져오기
    Native.preference.loadString('key', function(result) {
        alert(`저장된 문자열: ${result}`);
    });
}

function onShowSplash() {
    // 스플래시 보이기
    Native.ui.showSplash();
    setTimeout(() => {
        // 스플래시 숨기기
        Native.ui.hideSplash(500);
    }, 3000);
}

function onShowLoading() {
    // 로딩 띄우기
    Native.ui.showLoading();
    setTimeout(() => {
        // 로딩 숨기기
        Native.ui.hideLoading();
    }, 3000);
}

function onPullToRefresh() {
    // Pull to refresh 활성화
    Native.ui.pullToRefresh(true);
    setTimeout(() => {
        // Pull to refresh 비활성화
        Native.ui.pullToRefresh(false);
    }, 3000);
}

function onShowAlert() {
    // 알림창 띄우기 (제목, 버튼명 변경을 위해)
    let options = {
        title: '알림',    // 기본값: 알림
        msg: '알림창 내용',
        btnText: '확인'   // 기본값: 확인
    };
    Native.ui.showAlert(options, function() {
        alert('확인 버튼을 클릭했습니다.');
    });
}

function onShowConfirm() {
    // 확인창 띄우기 (제목, 버튼명 변경을 위해)
    let options = {
        title: '알림',        // 기본값: 알림
        msg: '확인창 내용',
        btnConfirm: '확인',   // 기본값: 확인
        btnCancel: '취소'     // 기본값: 취소
    };
    Native.ui.showConfirm(options, function(idx) {
        if (idx == 0) {
            alert('취소 버튼을 클릭했습니다.');
        } else if (idx == 1) {
            alert('확인 버튼을 클릭했습니다.');
        }
    });
}

function onShowPrompt() {
    // 프롬프트창 띄우기 (제목, 버튼명 변경을 위해)
    let options = {
        title: '알림',            // 기본값: 알림
        msg: '프롬프트창 내용',
        text: '기본 입력 문자열',
        btnConfirm: '확인',       // 기본값: 확인
        btnCancel: '취소'         // 기본값: 취소
    };
    Native.ui.showPrompt(options, function(idx, text) {
        if (idx == 0) {
            alert('취소 버튼을 클릭했습니다.');
        } else if (idx == 1) {
            alert(`입력된 문자열: ${text}`);
        }
    });
}

function onShowToast() {
    // 토스트 띄우기
    Native.ui.showToast('토스트 메세지 내용');
}

function onHideKeyboard() {
    // 키보드 내리기
    Native.ui.hideKeyboard();
}

function onAjax() {
    // 로딩 띄우기
    Native.ui.showLoading();
    // 크로스 브라우져를 위한 네트워크 통신
    let options = {
        url: 'https://dl.dropboxusercontent.com/s/460oyzrb1p59rlk/data.json',
        method: 'GET', // 기본값: GET
        headers: {
            //Authorization: 'Bearer 액세스토큰',
            key: 'value'
        },
        params: {
            key: 'value'
        },
        isJson: false // 기본값: false
    };
    Native.netowrk.request(options, function(isSucc, result) {
        // 로딩 숨기기
        Native.ui.hideLoading();
        if (isSucc) {
            alert(`네트워크 통신 결과: ${result}`);
        } else {
            alert('네트워크 통신에 실패했습니다.');
        }
    });
}

function onFileDownload() {
    // 로딩 띄우기
    Native.ui.showLoading();
    Native.ui.showToast('파일 다운로드 중입니다.');
    // 파일 URL 다운로드
    let options = {
        url: 'https://developer.apple.com/ibeacon/Getting-Started-with-iBeacon.pdf',
        method: 'GET', // 기본값: GET
        headers: {
            //Authorization: 'Bearer 액세스토큰',
            key: 'value'
        },
        params: {
            key: 'value'
        },
        isJson: false, // 기본값: false
        useTempDir: true, // 기본값: true (자동 삭제되는 임시 폴더 사용 여부)
        ext: 'pdf' // 기본값: 파일 다운로드 URL의 확장자 (확장자가 없을 경우 선언 필요)
    };
    Native.netowrk.download(options, function(isSucc, filePath) {
        // 로딩 숨기기
        Native.ui.hideLoading();
        if (isSucc) {
            // 확인창 띄우기
            let options = {
                msg: '다운로드된 파일 경로: ' + filePath,
                btnConfirm: '공유',
                btnCancel: '미리보기'
            };
            Native.ui.showConfirm(options, function(idx) {
                if (idx == 1) {
                    // 다운로드된 파일 공유
                    Native.app.fileShare(filePath);
                } else if (idx == 0) {
                    // 파일 열기 (미리보기)
                    Native.app.fileViewer(filePath, function() {
                        // 다운로드된 파일 공유
                        Native.app.fileShare(filePath);
                    });
                    // 외부 브라우져로 열기
                    //Native.app.webBrowser(url);
                }
            });
        } else {
            alert('다운로드에 실패했습니다.');
        }
    }, function(percent, length, total) {
        console.log(`파일 다운로드 진행률: ${percent}% (${length}bytes / ${total}bytes)`);
    });
}

function onWebBrowser() {
    // 외부 웹브라우저 열기
    Native.app.webBrowser('https://m.daum.net');
}

function onAppBrowser() {
    // 내부 웹브라우저 열기
    Native.app.appBrowser('https://m.daum.net');
}

function onWebViewer() {
    // 서브 웹뷰 열기
    Native.app.webViewer('https://m.daum.net');
}

function onVLCPlayer() {
    // VLC 플레이어 열기
    Native.app.vlcPlayer('http://streams.videolan.org/streams/mp4/Mr_MrsSmith-h264_aac.mp4');
}

function onMain() {
    let hasUrl = false;
    if (hasUrl) {
        let url = 'https://m.daum.net';
        Native.app.main(url); // 메인 화면에서 URL 이동
    } else {
        Native.app.main();
    }
}

function onClose() {
    // (서브 화면에서 호출 시) 현재 화면 종료 (메인 화면일 경우 동작 X)
    Native.app.close();//Native.app.back();
}

function onFileViewer() {
    let url = 'https://developer.apple.com/ibeacon/Getting-Started-with-iBeacon.pdf';
    Native.app.fileViewer(url, function() {
        console.log('파일 뷰어 종료');
    });
}

function onLinkShare() {
    // 링크 URL 공유
    let url = 'https://m.daum.net';
    Native.app.linkShare(url);
}

function onLaunch() {
    var userAgent = navigator.userAgent.toLowerCase();
    let options = {
        scheme: null,
        market: null,
        finish: false // 기본값: false (앱 실행 및 스토어 이동 시 앱 종료 여부)
    };
    if (userAgent.indexOf("android") > -1) {
        options.scheme = 'com.kakao.talk'; // 패키지명 또는 스키마
        options.market = 'https://play.google.com/store/apps/details?id=com.kakao.talk';
    } else if (userAgent.indexOf("iphone") > -1 || userAgent.indexOf("ipad") > -1 || userAgent.indexOf("ipod") > -1) {
        options.scheme = 'kakaotalk';
        options.market = 'https://apps.apple.com/kr/app/%EC%B9%B4%EC%B9%B4%EC%98%A4%ED%86%A1/id362057947';
    }
    // 앱이 설치된 경우 앱 실행, 미설치된 경우 스토어로 이동
    Native.app.launch(options);
}

function onOrientation() {
    // 화면 회전
    let orientation = 'landscape';
    Native.app.orientation(orientation);
    setTimeout(function() {
        orientation = 'portrait';
        Native.app.orientation(orientation);
    }, 5000);
}

function onRemoveCookies() {
    // 쿠키 삭제 (모든 쿠키, 도메인 쿠키, 특정 쿠키)
    let options = {
        domain: '.naver.com',
        key: 'NID_AUT'
    };
    options.domain = null;
    options.key = null;
    Native.app.removeCookies(function() {
        if (options.key == null) {
            if (options.domain == null) {
                alert('웹뷰의 모든 쿠키를 삭제했습니다.');
            } else {
                alert('도메인의 모든 쿠키를 삭제했습니다.');
            }
        } else {
            alert(`특정 쿠키의 키값 (${options.key})의 쿠키를 삭제했습니다.`);
        }
    }, options);
}

function onRefreshToken() {
    // 로딩 띄우기
    Native.ui.showLoading();
    // 푸시 토큰 삭제 후 재발급 (DB 푸시 토큰 업데이트 필요)
    Native.app.refreshToken(function(token) {
        // 로딩 숨기기
        Native.ui.hideLoading();
        alert(`재발급된 푸시 토큰: ${token}`);
        onAppInfo();
    });
}

function onLogout() {
    // 로딩 띄우기
    Native.ui.showLoading();
    // 로그아웃 함수 (상태바 푸시 알림 삭제, 푸시 토큰 삭제 및 재발급) - 로그아웃 시 푸시를 받지 않도록 하기 위한 처리 (재로그인 시 DB 푸시 토큰 업데이트 필요)
    Native.app.logout(function(token) {
        // 로딩 숨기기
        Native.ui.hideLoading();
        alert(`재발급된 푸시 토큰: ${token}`);
        onAppInfo();
    });
}

function onFinish() {
    // 앱 종료
    Native.app.finish();
}

function onBarcodeScanner() {
    let options = {
        permissionType: 'camera',
        request: true // 기본값: false
    };
    Native.permission.check(options, function(hasPermission) {
        if (hasPermission) {
            console.log('카메라 권한 존재');
            // 확인창 띄우기
            let options = {
                msg: '바코드를 스캔하시겠습니까?',
                btnConfirm: '범용 바코드',
                btnCancel: 'QR 바코드'
            };
            Native.ui.showConfirm(options, function(idx) {
                if (idx == 0) {
                    // QR 바코드 스캔 및 결과값 가져오기
                    Native.barcode.scanner(function(result) {
                        alert(`QR 바코드 스캔 결과: ${result}`);
                    }, {
                        filterTypes: ['QR_CODE'/*, 'CODE_128'*/]
                    });
                } else if (idx == 1) {
                    // 범용 바코드 스캔 및 결과값 가져오기
                    Native.barcode.scanner(function(result) {
                        alert(`범용 바코드 스캔 결과: ${result}`);
                    });
                }
            });
        } else {
            if (options.request) {
                alert('카메라 권한이 없거나 거부된 상태 (설정 화면으로 이동)');
                onPermissionSettings(options.permissionType);
            } else {
                alert('카메라 권한 없음');
            }
        }
    });
}

function onGPSEnabled() {
    Native.location.isGPSEnabled(function(isEnabled) {
        if (!!isEnabled) {
            alert('GPS가 켜져있습니다.');
        } else {
            alert('GPS가 꺼져있습니다.');
        }
    });
}

function onGPSSettings() {
    Native.location.moveGPSSettings(function() {
        onGPSEnabled();
    });
}

function onMyLocation() {
    let options = {
        permissionType: 'location',
        request: true // 기본값: false
    };
    Native.permission.check(options, function(hasPermission) {
        if (hasPermission) {
            console.log('위치 권한 존재');
            // 내 위치 정보 조회
            options = {
                repeat: true // 지속적으로 내 위치 정보 조회 여부 (기본값: false) - true일 경우, 위치 정보 조회 종료 함수 호출 필요
            };
            Native.location.myLocation(function(obj) {
                if (!!obj) {
                    console.log(JSON.stringify(obj));//alert(JSON.stringify(obj));
                    alert(`위도: ${obj.latitude}\n경도: ${obj.longitude}\n고도: ${obj.altitude}m\n방위: ${obj.heading}°\n속도: ${obj.speed}m/s\n갱신시간: ${obj.time}`);
                } else {
                    alert('내 위치 정보 조회에 실패했습니다.');
                }
            }, options);
        } else {
            if (options.request) {
                alert('위치 권한이 없거나 거부된 상태 (설정 화면으로 이동)');
                onPermissionSettings(options.permissionType);
            } else {
                alert('위치 권한 없음');
            }
        }
    });
}

function onLocationCalculate() {
    let options = {
        permissionType: 'location',
        request: true // 기본값: false
    };
    Native.permission.check(options, function(hasPermission) {
        if (hasPermission) {
            console.log('위치 권한 존재');
            // 내 위치 정보 조회
            options = {
                repeat: false // 지속적으로 내 위치 정보 조회 여부 (기본값: false) - true일 경우, 위치 정보 조회 종료 함수 호출 필요
            };
            Native.location.myLocation(function(obj) {
                if (!!obj) {
                    console.log(JSON.stringify(obj));//alert(JSON.stringify(obj));
                    console.log(`위도: ${obj.latitude}\n경도: ${obj.longitude}\n고도: ${obj.altitude}m\n방위: ${obj.heading}°\n속도: ${obj.speed}m/s\n갱신시간: ${obj.time}`);
                    let loc1 = {
                        latitude: obj.latitude,
                        longitude: obj.longitude
                    }
                    let loc2 = {
                        latitude: '37.57861',   // 경복궁 위도
                        longitude: '126.97722'  // 경복궁 경도
                    }
                    // 두 위치 간 방위/거리 계산 (현재 위치, 경복궁)
                    Native.location.calculate(loc1, loc2, function(bearing, distance) {
                        if (bearing != null && distance != null) {
                            alert(`현재 위치에서 경복궁까지의 방위/거리: ${bearing}°/${distance}m`);
                        } else {
                            alert('현재 위치에서 경복궁까지의 방위/거리 계산에 실패했습니다.');
                        }
                    });
                } else {
                    alert('내 위치 정보 조회에 실패했습니다.');
                }
            }, options);
        } else {
            if (options.request) {
                alert('위치 권한이 없거나 거부된 상태 (설정 화면으로 이동)');
                onPermissionSettings(options.permissionType);
            } else {
                alert('위치 권한 없음');
            }
        }
    });
}

function onLocationFinish() {
    // 지속적인 위치 정보 가져오기 종료 - 지속적으로 위치 정보를 가져올 경우, 위치 사용 종료 시 반드시 호출 필요
    Native.location.finish();
}

function onSchemaUrl() {
    // (타 앱에서 로그인 후 앱 스키마 실행 시 결과값 처리를 위해) 앱 스키마 URL 실행 시 onURL 함수 호출
    let url = 'hybrid://login?token=accessToken&registrationId=kakao';
    Native.app.webBrowser(url);
}

/** ---- 네이티브 연동 함수 (웹에서 호출) : END ---- */
