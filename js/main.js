/// <reference path="gameMain.js">
/// <reference path="vertex.js">



// Main
onload = function(){

	var width = 800;
	var height = 600;

	var mouseX = 0;
	var mouseY = 0;

	var beforeMouseX = 0;		// 1フレーム前のマウス座標
	var beforeMouseY = 0;

	var keyW = -1;
	var keyA = -1;
	var keyS = -1;
	var keyD = -1;
	var keyEnter = -1;

	var flagMouseClick = false;		// クリックされているか

	var count = 0;
	var blockPos = 0;

	var objRadX = 0;		// オブジェクトの傾き (マウス操作で動かされる)
	var objRadY = -0.1;


	var lightDirection = [-0.1, 1.0, 1.0];		// 平行光源の向き
	var ambientColor = [0.1, 0.1, 0.1, 1.0];	// 環境光の色

	var c = document.getElementById("canvas");
	c.width = width;
	c.height = height;

	c.addEventListener("mousemove", mouseMove);
	c.addEventListener("mousedown", mouseDown);
	c.addEventListener("mouseup", mouseUp);
	c.addEventListener("mouseout", mouseOut);
	window.addEventListener("keydown", keyDown);
	window.addEventListener("keyup", keyUp);

	var gl = c.getContext("webgl") || c.getContext("experimental-webgl");
	
	var GM = new GameMain();



	// 頂点シェーダー・フラグメントシェーダー作成
	var v_shader = create_shader("vs");
	var f_shader = create_shader("fs");
	var prg = create_program(v_shader, f_shader);
	
	// シェーダー内において何番目のデータなのか
	var attLocation = new Array();
	attLocation[0] = gl.getAttribLocation(prg, "position");
	attLocation[1] = gl.getAttribLocation(prg, "normal");
	attLocation[2] = gl.getAttribLocation(prg, "color");
	
	// そのデータはいくつの要素があるのか
	var attStride = new Array();
	attStride[0] = 3;
	attStride[1] = 3;
	attStride[2] = 4;
	
	// uniformLocationを配列に取得
	var uniLocation = new Array();
	uniLocation[0] = gl.getUniformLocation(prg, "mvpMatrix");
	uniLocation[1] = gl.getUniformLocation(prg, "invMatrix");
	uniLocation[2] = gl.getUniformLocation(prg, "lightDirection");
	uniLocation[3] = gl.getUniformLocation(prg, "ambientColor");



	// 立方体モデルデータ
	var position_cube = getPosition_Cube();
	var normal_cube = getNormal_Cube();
	//var color_cube = getColor_Cube();
	var index_cube = getIndex_Cube();

	var color_cube = new Array();

	color_cube[0] = getColor(position_cube.length/3, 0.1, 0.8, 1);		// 通常色
	color_cube[1] = getColor(position_cube.length/3, 1, 1, 0);
	color_cube[2] = getColor(position_cube.length/3, 0.2, 1, 0.3);
	color_cube[3] = getColor(position_cube.length/3, 0.9, 0.1, 0.1);
	color_cube[4] = getColor(position_cube.length/3, 0.1, 0.1, 1);
	color_cube[5] = getColor(position_cube.length/3, 1, 0.6, 0.1);
	color_cube[6] = getColor(position_cube.length/3, 0.9, 0, 0.9);

	color_cube[7] = getColor(position_cube.length/3, 0.3, 1, 1);		// ゴースト色
	color_cube[8] = getColor(position_cube.length/3, 1, 1, 0.2);
	color_cube[9] = getColor(position_cube.length/3, 0.4, 1, 0.5);
	color_cube[10] = getColor(position_cube.length/3, 1, 0.3, 0.3);
	color_cube[11] = getColor(position_cube.length/3, 0.3, 0.3, 1);
	color_cube[12] = getColor(position_cube.length/3, 1, 0.8, 0.3);
	color_cube[13] = getColor(position_cube.length/3, 1, 0.2, 1);

	// VBO・IBOの生成
	var pos_vbo_cube = create_vbo(position_cube);
	var nor_vbo_cube = create_vbo(normal_cube);
	//var col_vbo_cube = create_vbo(color_cube);
	var idx_ibo_cube = create_ibo(index_cube);
	
	var col_vbo_cube = new Array();

	for(var i=0; i<14; i++){
		col_vbo_cube[i] = create_vbo(color_cube[i]);
	}


	
	// 枠モデルデータ
	var position_frame = getPosition_frame(10, 20);
	var normal_frame = getNormalFromPos(position_frame);
	var color_frame = getColor(position_frame.length/3, 0.6, 0.8, 0.6);
	var index_frame = getIndex(position_frame.length/3);

	// VBO・IBOの生成
	var pos_vbo_frame = create_vbo(position_frame);
	var nor_vbo_frame = create_vbo(normal_frame);
	var col_vbo_frame = create_vbo(color_frame);
	var idx_ibo_frame = create_ibo(index_frame);
	
	

	// 文字モデルデータ配列
	var position_char = new Array();
	var normal_char = new Array();
	var color_char = new Array();
	var index_char = new Array();

	position_char[0] = getPosition_charG();
	position_char[1] = getPosition_charA();
	position_char[2] = getPosition_charM();
	position_char[3] = getPosition_charE();
	position_char[4] = getPosition_charO();
	position_char[5] = getPosition_charV();
	position_char[6] = getPosition_charR();
	position_char[7] = getPosition_charP();
	position_char[8] = getPosition_charS();
	position_char[9] = getPosition_charN();
	position_char[10] = getPosition_charT();

	for(var i=0; i<11; i++){
		normal_char[i] = getNormalFromPos(position_char[i]);
		color_char[i] = getColor(position_char[i].length/3, 1, 1, 0.5);
		index_char[i] = getIndex(position_char[i].length/3);
	}

	// VBO・IBOの生成 (配列)
	var pos_vbo_char = new Array();
	var nor_vbo_char = new Array();
	var col_vbo_char = new Array();
	var idx_ibo_char = new Array();

	for(var i=0; i<11; i++){
		pos_vbo_char[i] = create_vbo(position_char[i]);
		nor_vbo_char[i] = create_vbo(normal_char[i]);
		col_vbo_char[i] = create_vbo(color_char[i]);
		idx_ibo_char[i] = create_ibo(index_char[i]);
	}



	// minMatrix.js を用いた行列関連処理
	// matIVオブジェクトを生成
	var m = new matIV();
	
	// 各種行列の生成と初期化
	var mMatrix = m.identity(m.create());
	var vMatrix = m.identity(m.create());
	var pMatrix = m.identity(m.create());
	var tmpMatrix = m.identity(m.create());
	var mvpMatrix = m.identity(m.create());
	var invMatrix = m.identity(m.create());
	


	// ビュー×プロジェクション座標変換行列
	m.lookAt([0, 0, 80], [0, 0, 0], [0, 1, 0], vMatrix);
	m.perspective(45, c.width / c.height, 0.1, 150, pMatrix);
	m.multiply(pMatrix, vMatrix, tmpMatrix);

	gl.uniform3fv(uniLocation[2], lightDirection);
	gl.uniform4fv(uniLocation[3], ambientColor);

	
	
	// カリングと深度テストを有効にする
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CW);		// 時計回りが表



	// 恒常ループ
	(function(){

		// canvasを初期化
		gl.clearColor(0.5, 0.6, 0.7, 1.0);
		gl.clearDepth(1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		

		keyUpdate();

		// キー操作
		GM.keyInput(keyW, keyA, keyS, keyD, keyEnter);

		// ゲームメイン Update
		GM.update();

		
		count++;
		
		var rad = count % 360 * Math.PI / 180;



		// マウスのドラッグでオブジェクトの回転
		if(flagMouseClick){

			var dx = mouseX - beforeMouseX;
			var dy = mouseY - beforeMouseY;

			objRadX += dx % 360 * Math.PI / 180;
			objRadY += dy % 360 * Math.PI / 180;
		}

		beforeMouseX = mouseX;
		beforeMouseY = mouseY;

		

		/*
		modelData.posVBO = 0;
		modelData.norVBO = 0;
		modelData.colVBO = 0;

		modelData.IBO = 0;
		modelData.index = 0;

		modelData.flagMR = false;
		modelData.flagTrans = false;
		modelData.flagRotate = false;
		modelData.flagRotate2 = false;
		modelData.flagScale = false;

		modelData.transX = 0;
		modelData.transY = 0;
		modelData.transZ = 0;

		modelData.rotateRad = 0;
		modelData.rotateX = 0;
		modelData.rotateY = 0;
		modelData.rotateZ = 0;

		modelData.rotateRad2 = 0;
		modelData.rotateX2 = 0;
		modelData.rotateY2 = 0;
		modelData.rotateZ2 = 0;

		modelData.scaleX = 1;
		modelData.scaleY = 1;
		modelData.scaleZ = 1;
		*/



		//----------------------------------------------------------------
		// 枠の描画
		//----------------------------------------------------------------

		// 構造体(として扱っている物)を生成
		var modelData = new structModel();

		// 描画に必要なデータを格納
		modelData.posVBO = pos_vbo_frame;
		modelData.norVBO = nor_vbo_frame;
		modelData.colVBO = col_vbo_frame;
		modelData.IBO = idx_ibo_frame;
		modelData.index = index_frame;
		modelData.flagMR = true;

		drawModel(modelData);
		

		
		// PRESSENTER の文字
		draw_PRESSENTER();


		
		// GAMESTART の文字
		draw_GAMESTART();



		// GAMEOVER の文字
		draw_GAMEOVER();

		
		
		// field に積み重なったブロックの描画
		draw_fieldBlock();



		// currentBlock と nextBlock と ghostBlock の座標を取得
		blockPos = GM.getPos();


		
		// ゴーストブロック描画
		draw_ghostBlock();



		// current ブロック描画
		draw_currentBlock();
		


		// next ブロック描画
		draw_nextBlock();



		// コンテキストの再描画
		gl.flush();
		
		// ループのために再帰呼び出し
		setTimeout(arguments.callee, 1000 / 30);
	})();
	


	// シェーダを生成する関数
	function create_shader(id){
		// シェーダを格納する変数
		var shader;
		
		// HTMLからscriptタグへの参照を取得
		var scriptElement = document.getElementById(id);
		
		// scriptタグが存在しない場合は抜ける
		if(!scriptElement)
			return;
		
		// scriptタグのtype属性をチェック
		switch(scriptElement.type){
			
			// 頂点シェーダの場合
			case "x-shader/x-vertex":
				shader = gl.createShader(gl.VERTEX_SHADER);
				break;
				
			// フラグメントシェーダの場合
			case "x-shader/x-fragment":
				shader = gl.createShader(gl.FRAGMENT_SHADER);
				break;
			default :
				return;
		}
		
		// 生成されたシェーダにソースを割り当てる
		gl.shaderSource(shader, scriptElement.text);
		
		// シェーダをコンパイルする
		gl.compileShader(shader);
		
		// シェーダが正しくコンパイルされたかチェック
		if(gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
			
			// 成功していたらシェーダを返して終了
			return shader;
		}else{
			
			// 失敗していたらエラーログをアラートする
			alert(gl.getShaderInfoLog(shader));
		}
	}
	


	// プログラムオブジェクトを生成しシェーダをリンクする関数
	function create_program(vs, fs){
		// プログラムオブジェクトの生成
		var program = gl.createProgram();
		
		// プログラムオブジェクトにシェーダを割り当てる
		gl.attachShader(program, vs);
		gl.attachShader(program, fs);
		
		// シェーダをリンク
		gl.linkProgram(program);
		
		// シェーダのリンクが正しく行なわれたかチェック
		if(gl.getProgramParameter(program, gl.LINK_STATUS)){
		
			// 成功していたらプログラムオブジェクトを有効にする
			gl.useProgram(program);
			
			// プログラムオブジェクトを返して終了
			return program;
		}else{
			
			// 失敗していたらエラーログをアラートする
			alert(gl.getProgramInfoLog(program));
		}
	}
	


	// VBOを生成する関数
	function create_vbo(data){
		// バッファオブジェクトの生成
		var vbo = gl.createBuffer();
		
		// バッファをバインドする
		gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
		
		// バッファにデータをセット
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
		
		// バッファのバインドを無効化
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		
		// 生成した VBO を返して終了
		return vbo;
	}
	


	// VBOをバインドし登録する関数
	function set_attribute(vbo, attL, attS){
		// 引数として受け取った配列を処理する
		for(var i in vbo){
			// バッファをバインドする
			gl.bindBuffer(gl.ARRAY_BUFFER, vbo[i]);
			
			// attributeLocationを有効にする
			gl.enableVertexAttribArray(attL[i]);
			
			// attributeLocationを通知し登録する
			gl.vertexAttribPointer(attL[i], attS[i], gl.FLOAT, false, 0, 0);
		}
	}
	


	// IBOを生成する関数
	function create_ibo(data){
		// バッファオブジェクトの生成
		var ibo = gl.createBuffer();
		
		// バッファをバインドする
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
		
		// バッファにデータをセット
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), gl.STATIC_DRAW);
		
		// バッファのバインドを無効化
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
		
		// 生成したIBOを返して終了
		return ibo;
	}



	//----------------------------------------------------------------
	// 入力関係
	//----------------------------------------------------------------

	// マウス座標取得
	function mouseMove(e){
		mouseX = e.clientX - c.offsetLeft;
		mouseY = e.clientY - c.offsetTop;
	}

	// マウスのいずれかのボタンが押された
	function mouseDown(e){
		flagMouseClick = true;
	}

	// マウスのいずれかのボタンが離された
	function mouseUp(e){
		flagMouseClick = false;
	}

	// マウスがcanvas外へ出た
	function mouseOut(e){
		flagMouseClick = false;
	}

	// キーが押された
	/*
		キーを一定時間長押しすると、ブラウザ側で勝手に連打扱いになるようなので
		その処理をプログラム側で記述する必要がない
	*/
	function keyDown(e){
		if(e.keyCode==87 || e.keyCode==38){		// W
			keyW = 0;

		}else if(e.keyCode==65 || e.keyCode==37){	// A
			keyA = 0;

		}else if(e.keyCode==83 || e.keyCode==40){	// S
			keyS = 0;

		}else if(e.keyCode==68 || e.keyCode==39){	// D
			keyD = 0;

		}else if(e.keyCode == 13){	// Enter
			keyEnter = 0;
		}
	}

	// キーが離された
	function keyUp(e){
		if(e.keyCode==87 || e.keyCode==38){		// W
			keyW = -1;

		}else if(e.keyCode==65 || e.keyCode==37){	// A
			keyA = -1;

		}else if(e.keyCode==83 || e.keyCode==40){	// S
			keyS = -1;

		}else if(e.keyCode==68 || e.keyCode==39){	// D
			keyD = -1;

		}else if(e.keyCode==13){	// Enter
			keyEnter = -1;
		}
	}

	// キーが押されている間、カウントが進む
	function keyUpdate(){
		if(keyW >= 0){
			keyW++;
		}
		if(keyA >= 0){
			keyA++;
		}
		if(keyS >= 0){
			keyS++;
		}
		if(keyD >= 0){
			keyD++;
		}
		if(keyEnter >= 0){
			keyEnter++;
		}
	}

	

	// 受け渡し用の構造体のような役割
	// モデル描画に必要なデータをまとめる
	function structModel(){

		this.posVBO = 0;	// 頂点VBO
		this.norVBO = 0;	// 法線VBO
		this.colVBO = 0;	// 色VBO

		this.IBO = 0;		// IBO
		this.index = 0;		// IBOになってないインデックス配列

		this.flagMR = false;	// マウス操作での回転を適用するか
		this.flagTrans = false;
		this.flagRotate = false;
		this.flagRotate2 = false;
		this.flagScale = false;

		this.transX = 0;		// flagTrans = true のときの詳細値
		this.transY = 0;
		this.transZ = 0;

		this.rotateRad = 0;		// flagRotate = true のときの詳細値
		this.rotateX = 0;
		this.rotateY = 0;
		this.rotateZ = 0;

		this.rotateRad2 = 0;	// flagRotate2 = true のときの詳細値
		this.rotateX2 = 0;
		this.rotateY2 = 0;
		this.rotateZ2 = 0;

		this.scaleX = 1;		// flagScale = true のときの詳細値
		this.scaleY = 1;
		this.scaleZ = 1;
	}



	// モデルを描画する一連の処理
	function drawModel(sm){


		// VBOを登録する
		set_attribute([sm.posVBO, sm.norVBO, sm.colVBO], attLocation, attStride);
		
		// IBOを登録する
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sm.IBO);


		m.identity(mMatrix);


		// マウス操作で回転
		if(sm.flagMR){
			m.rotate(mMatrix, objRadX, [0, 1, 0], mMatrix);
			m.rotate(mMatrix, objRadY, [1, 0, 0], mMatrix);
		}
		
		// 平行移動してからの回転
		if(sm.flagRotate2){
			m.rotate(mMatrix, sm.rotateRad2, [sm.rotateX2, sm.rotateY2, sm.rotateZ2], mMatrix);
		}

		// 平行移動
		if(sm.flagTrans){
			m.translate(mMatrix, [sm.transX, sm.transY, sm.transZ], mMatrix);
		}

		// 原点での回転
		if(sm.flagRotate){
			m.rotate(mMatrix, sm.rotateRad, [sm.rotateX, sm.rotateY, sm.rotateZ], mMatrix);
		}
		
		// 拡大縮小
		if(sm.flagScale){
			m.scale(mMatrix, [sm.scaleX, sm.scaleY, sm.scaleZ], mMatrix);
		}


		m.multiply(tmpMatrix, mMatrix, mvpMatrix);
		
		// 逆行列を生成
		m.inverse(mMatrix, invMatrix);
		
		// uniform変数の登録
		gl.uniformMatrix4fv(uniLocation[0], false, mvpMatrix);
		gl.uniformMatrix4fv(uniLocation[1], false, invMatrix);
		
		// 描画
		gl.drawElements(gl.TRIANGLES, sm.index.length, gl.UNSIGNED_SHORT, 0);
	}



	// PRESSENTER の文字を表示する
	var count_PRESSENTER = 0;

	function draw_PRESSENTER(){

		if(GM.flag_PRESSENTER){

			count_PRESSENTER++;
			var charNumList = [7, 6, 3, 8, 8, 3, 9, 10, 3, 6];		// 文字の並び

			for(var i=0; i<10; i++){

				var modelData = new structModel();					// 基本データを格納
				modelData.posVBO = pos_vbo_char[ charNumList[i] ];
				modelData.norVBO = nor_vbo_char[ charNumList[i] ];
				modelData.colVBO = col_vbo_char[ charNumList[i] ];
				modelData.IBO = idx_ibo_char[ charNumList[i] ];
				modelData.index = index_char[ charNumList[i] ];
				modelData.flagTrans = true;
				modelData.flagRotate = true;
				
				if(i >= 5){
					modelData.transX = -23.5 + 2 + i*5;		// 中央にスペースをあける
				}else{
					modelData.transX = -23.5 + i*5;
				}
				
				modelData.transY = -25;
				modelData.transZ = 10;

				if(count_PRESSENTER >= 80){
					count_PRESSENTER = 0;
				}

				var kaku;

				if(count_PRESSENTER>=1+i*3 && count_PRESSENTER<=35+i*3){	// 少しずつずらして回転
					kaku = (count_PRESSENTER-i*3)*10;
				}else{
					kaku = 0;
				}

				modelData.rotateRad = kaku*Math.PI/180;
				modelData.rotateY = 1;

				drawModel(modelData);
			}
		}else{
			count_PRESSENTER = 0;
		}
	}



	// GAMESTART の文字を表示する
	var count_GAMESTART = 0;

	function draw_GAMESTART(){

		if(GM.flag_GAMESTART){

			count_GAMESTART++;
			var charNumList = [0, 1, 2, 3, 8, 10, 1, 6, 10];

			for(var i=0; i<9; i++){
				
				var modelData = new structModel();					// 基本データを格納
				modelData.posVBO = pos_vbo_char[ charNumList[i] ];
				modelData.norVBO = nor_vbo_char[ charNumList[i] ];
				modelData.colVBO = col_vbo_char[ charNumList[i] ];
				modelData.IBO = idx_ibo_char[ charNumList[i] ];
				modelData.index = index_char[ charNumList[i] ];
				modelData.flagTrans = true;
				modelData.flagRotate = true;
				modelData.transX = -20 + i*5;
				
				var kaku;

				if(count_GAMESTART>=18+i && count_GAMESTART<=30+i){		// 停止
					modelData.transZ = 35;
					kaku = 0;
				}else if(count_GAMESTART >= 31+i){						// 後半
					modelData.transZ = -37 + (count_GAMESTART-12-i)*4;
					kaku = -180 + (count_GAMESTART-12-i)*10;
				}else{													// 前半
					modelData.transZ = -37 + (count_GAMESTART-i)*4;
					kaku = -180 + (count_GAMESTART-i)*10;
				}
				
				modelData.rotateRad = -kaku*Math.PI/180;
				modelData.rotateX = 1;
				
				drawModel(modelData);
			}

			if(count_GAMESTART >= 45){			// 手前に近づき過ぎるまえに終了
				GM.flag_GAMESTART = false;
				count_GAMESTART = 0;
				objRadX = 0;
				objRadY = -0.1;
			}
		}
	}



	// GAMEOVER の文字を表示する
	var count_GAMEOVER = 0;

	function draw_GAMEOVER(){

		if(GM.flag_GAMEOVER >= 1){

			count_GAMEOVER++;
			var charNumList = [0, 1, 2, 3, 4, 5, 3, 6];

			for(var i=0; i<8; i++){
				
				var modelData = new structModel();					// 基本データを格納
				modelData.posVBO = pos_vbo_char[ charNumList[i] ];
				modelData.norVBO = nor_vbo_char[ charNumList[i] ];
				modelData.colVBO = col_vbo_char[ charNumList[i] ];
				modelData.IBO = idx_ibo_char[ charNumList[i] ];
				modelData.index = index_char[ charNumList[i] ];
				modelData.flagTrans = true;
				modelData.flagRotate = true;
				modelData.flagScale = true;

				if(i >= 4){
					modelData.transX = -18.5 + 2 + i*5;
				}else{
					modelData.transX = -18.5 + i*5;
				}
				
				modelData.transZ = 35;
				
				if(count_GAMEOVER >= 90){
					count_GAMEOVER = 20;
				}

				var kaku;

				if(count_GAMEOVER < 10){
					kaku = -200 + count_GAMEOVER*20;
					modelData.rotateZ = 1;

					modelData.scaleX = 0.1*count_GAMEOVER;
					modelData.scaleY = 0.1*count_GAMEOVER;
					modelData.scaleZ = 0.1*count_GAMEOVER;

				}else if(count_GAMEOVER>=20+i*2 && count_GAMEOVER<=54+i*2){
					kaku = (count_GAMEOVER-19-i*2)*10;
					modelData.rotateY = 1;
					GM.flag_GAMEOVER = 2;

				}else{
					kaku = 0;
				}
				
				modelData.rotateRad = kaku*Math.PI/180;
				
				drawModel(modelData);
			}
		}else{
			count_GAMEOVER = 0;
		}
	}



	// field に積み重なったブロックの描画
	var count_field = 0;

	function draw_fieldBlock(){

		if(GM.flag_field >= 1){

			if(GM.flag_field==2 || GM.flag_field==3){		// 消失アニメーションの後非表示に
				count_field++;
			}

			for(var i=0; i<20; i++){		// 配列は左下が基準となる
				for(var j=0; j<10; j++){

					// ブロックが存在するときだけ描画
					if(field[i][j] != -1){

						var modelData = new structModel();
						modelData.posVBO = pos_vbo_cube;
						modelData.norVBO = nor_vbo_cube;
						modelData.colVBO = col_vbo_cube[ field[i][j] ];
						modelData.IBO = idx_ibo_cube;
						modelData.index = index_cube;
						modelData.flagMR = true;
						modelData.flagTrans = true;
						modelData.flagScale = true;

						modelData.transX = -9 + j*2;
						modelData.transY = -19 + i*2;
						
						if(GM.flag_field == 2){		// 消失アニメーションの後非表示に
							modelData.scaleX = 0.9 - 0.1*count_field;
							modelData.scaleY = 0.9 - 0.1*count_field;
							modelData.scaleZ = 0.9 - 0.1*count_field;
						}else if(GM.flag_field == 3){

							if(GM.saveFieldLine[i] == 2){	// そろった列だけ消失アニメーション
								modelData.scaleX = 0.9 - 0.1*count_field;
								modelData.scaleY = 0.9 - 0.1*count_field;
								modelData.scaleZ = 0.9 - 0.1*count_field;
							}else{
								modelData.scaleX = 0.9;
								modelData.scaleY = 0.9;
								modelData.scaleZ = 0.9;
							}
						}else{
							modelData.scaleX = 0.9;
							modelData.scaleY = 0.9;
							modelData.scaleZ = 0.9;
						}

						drawModel(modelData);

					}// if end (ブロック存在)
				}// for end (10)
			}// for end (20)

			if(count_field == 9){	// アニメーション終了
				if(GM.flag_field == 2){
					count_field = 0;
					GM.flag_field = 0;

				}else if(GM.flag_field == 3){
					count_field = 0;
					GM.flag_field = 4;
				}
			}
		}// if end (flag)
	}



	// ゴーストブロック描画
	function draw_ghostBlock(){
		
		if(GM.flag_ghostBlock == 1){

			for(var i=0; i<4; i++){

				var x = -9 + blockPos[2][i][0] * 2;
				var y = -19 + blockPos[2][i][1] * 2;
				
				if(y <= 19){
					var modelData = new structModel();
					modelData.posVBO = pos_vbo_cube;
					modelData.norVBO = nor_vbo_cube;
					modelData.colVBO = col_vbo_cube[ GM.currentBlock.type+7 ];
					modelData.IBO = idx_ibo_cube;
					modelData.index = index_cube;
					modelData.flagMR = true;
					modelData.flagTrans = true;
					modelData.flagScale = true;

					modelData.transX = x;
					modelData.transY = y;

					modelData.scaleX = 0.7;
					modelData.scaleY = 0.7;
					modelData.scaleZ = 0.7;

					drawModel(modelData);
				}
			}
		}// if end
	}


	
	// current ブロック描画
	function draw_currentBlock(){
		
		if(GM.flag_currentBlock == 1){

			for(var i=0; i<4; i++){

				var x = -9 + blockPos[0][i][0] * 2;
				var y = -19 + blockPos[0][i][1] * 2;
				
				if(y <= 19){
					var modelData = new structModel();
					modelData.posVBO = pos_vbo_cube;
					modelData.norVBO = nor_vbo_cube;
					modelData.colVBO = col_vbo_cube[ GM.currentBlock.type ];
					modelData.IBO = idx_ibo_cube;
					modelData.index = index_cube;
					modelData.flagMR = true;
					modelData.flagTrans = true;
					modelData.flagScale = true;

					modelData.transX = x;
					modelData.transY = y;

					modelData.scaleX = 0.9;
					modelData.scaleY = 0.9;
					modelData.scaleZ = 0.9;

					drawModel(modelData);
				}
			}
		}// if end
	}



	// next ブロック描画
	var count_next = 0;

	function draw_nextBlock(){
		
		if(GM.flag_nextBlock >= 1){

			if(GM.flag_nextBlock == 2){
				count_next++;
			}

			for(var i=0; i<4; i++){

				var x = -9 + blockPos[1][i][0] * 2;
				var y = -19 + blockPos[1][i][1] * 2;
				
				if(y <= 19){
					var modelData = new structModel();
					modelData.posVBO = pos_vbo_cube;
					modelData.norVBO = nor_vbo_cube;
					modelData.colVBO = col_vbo_cube[ GM.nextBlock.type ];
					modelData.IBO = idx_ibo_cube;
					modelData.index = index_cube;
					modelData.flagMR = true;
					modelData.flagTrans = true;
					modelData.flagScale = true;

					modelData.transX = x;
					modelData.transY = y;

					if(GM.flag_nextBlock == 2){
						modelData.scaleX = 0.9 - 0.1*count_next;
						modelData.scaleY = 0.9 - 0.1*count_next;
						modelData.scaleZ = 0.9 - 0.1*count_next;
					}else{
						modelData.scaleX = 0.9;
						modelData.scaleY = 0.9;
						modelData.scaleZ = 0.9;
					}

					drawModel(modelData);
				}
			}

			if(count_next == 9){
				count_next = 0;
				GM.flag_nextBlock = 0;
			}
		}
	}
	


};