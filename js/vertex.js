//----------------------------------------------------------------
// 頂点情報の定義など
//----------------------------------------------------------------



// 頂点配列 立方体
function getPosition_Cube(){

	var position = [
		-1.0,  1.0, 1.0,	// 手前
		 1.0,  1.0, 1.0,
		-1.0, -1.0, 1.0,
		 1.0, -1.0, 1.0,

		1.0,  1.0,  1.0,	// 右
		1.0,  1.0, -1.0,
		1.0, -1.0,  1.0,
		1.0, -1.0, -1.0,

		 1.0,  1.0, -1.0,	// 奥
		-1.0,  1.0, -1.0,
		 1.0, -1.0, -1.0,
		-1.0, -1.0, -1.0,

		-1.0,  1.0, -1.0,	// 左
		-1.0,  1.0,  1.0,
		-1.0, -1.0, -1.0,
		-1.0, -1.0,  1.0,

		-1.0, 1.0, -1.0,	// 上
		 1.0, 1.0, -1.0,
		-1.0, 1.0,  1.0,
		 1.0, 1.0,  1.0,

		-1.0, -1.0,  1.0,	// 下
		 1.0, -1.0,  1.0,
		-1.0, -1.0, -1.0,
		 1.0, -1.0, -1.0
	];

	return position;
}



// 法線配列 立方体
function getNormal_Cube(){

	var normal = [
		0.0, 0.0, 1.0,		// 手前
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,

		1.0, 0.0, 0.0,		// 右
		1.0, 0.0, 0.0,
		1.0, 0.0, 0.0,
		1.0, 0.0, 0.0,

		0.0, 0.0, -1.0,		// 奥
		0.0, 0.0, -1.0,
		0.0, 0.0, -1.0,
		0.0, 0.0, -1.0,

		-1.0, 0.0, 0.0,		// 左
		-1.0, 0.0, 0.0,
		-1.0, 0.0, 0.0,
		-1.0, 0.0, 0.0,

		0.0, 1.0, 0.0,		// 上
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,

		0.0, -1.0, 0.0,		// 下
		0.0, -1.0, 0.0,
		0.0, -1.0, 0.0,
		0.0, -1.0, 0.0
	];

	return normal;
}



// 色配列 立方体
function getColor_Cube(){

	var color = [];

	for(var i=0; i<4*4*6; i++){		// RGBA * 4頂点 * 6面
		color.push(1.0);
	}

	return color;
}



// インデックス配列 立方体
function getIndex_Cube(){

	var index = [
		0, 1, 2,		// 手前
		1, 3, 2,

		4, 5, 6,		// 右
		5, 7, 6,

		8, 9, 10,		// 奥
		9, 11, 10,

		12, 13, 14,		// 左
		13, 15, 14,

		16, 17, 18,		// 上
		17, 19, 18,

		20, 21, 22,		// 下
		21, 23, 22
	];

	return index;
}



// 与えられた頂点配列から法線配列を生成
function getNormalFromPos(pos){

	var normal = [];
	var len = pos.length / 9;		// ポリゴン数を求める (配列長 ÷ 3頂点 ÷ 3座標xyz)


	for(var i=0; i<len; i++){

		// ポリゴンを構成する3つの頂点を取得
		var v = new Array(3);

		for(var j=0; j<3; j++){

			var b = i*9+j*3;
			v[j] = [  pos[ b ], pos[ b+1 ], pos[ b+2 ]  ];
		}


		// 外積を求める
		var vecA = [ v[2][0]-v[0][0], v[2][1]-v[0][1], v[2][2]-v[0][2] ];
		var vecB = [ v[1][0]-v[0][0], v[1][1]-v[0][1], v[1][2]-v[0][2] ];
		
		for(var j=0; j<3; j++){
			normal.push( vecA[1] * vecB[2] - vecA[2] * vecB[1] );	// x
			normal.push( vecA[2] * vecB[0] - vecA[0] * vecB[2] );	// y
			normal.push( vecA[0] * vecB[1] - vecA[1] * vecB[0] );	// z
		}
	}

	return normal;
}



// 頂点数とRGB値を受け取って色配列を返す
function getColor(num, r, g, b){

	var color = [];

	for(var i=0; i<num; i++){
		color.push(r, g, b, 1.0);
	}

	return color;
}



// インデックス配列を返す (汎用)
function getIndex(num){

	var index = [];

	for(var i=0; i<num; i++){
		index.push(i);
	}

	return index;
}



// 文字モデルの頂点配列を生成
function getCharPosFromIndex(index){

	/*
	var position = [
		-2,  2,  1,    -1,  2,  1,    0,  2,  1,    1,  2,  1,    2,  2,  1,	// 手前25頂点
		-2,  1,  1,    -1,  1,  1,    0,  1,  1,    1,  1,  1,    2,  1,  1,
		-2,  0,  1,    -1,  0,  1,    0,  0,  1,    1,  0,  1,    2,  0,  1,
		-2, -1,  1,    -1, -1,  1,    0, -1,  1,    1, -1,  1,    2, -1,  1,
		-2, -2,  1,    -1, -2,  1,    0, -2,  1,    1, -2,  1,    2, -2,  1,

		-2,  2, -1,    -1,  2, -1,    0,  2, -1,    1,  2, -1,    2,  2, -1,	// 奥25頂点
		-2,  1, -1,    -1,  1, -1,    0,  1, -1,    1,  1, -1,    2,  1, -1,
		-2,  0, -1,    -1,  0, -1,    0,  0, -1,    1,  0, -1,    2,  0, -1,
		-2, -1, -1,    -1, -1, -1,    0, -1, -1,    1, -1, -1,    2, -1, -1,
		-2, -2, -1,    -1, -2, -1,    0, -2, -1,    1, -2, -1,    2, -2, -1
	];
	*/

	var position = [
		[-2,  2,  0.5], [-1,  2,  0.5], [0,  2,  0.5], [1,  2,  0.5], [2,  2,  0.5],		// 手前25頂点
		[-2,  1,  0.5], [-1,  1,  0.5], [0,  1,  0.5], [1,  1,  0.5], [2,  1,  0.5],
		[-2,  0,  0.5], [-1,  0,  0.5], [0,  0,  0.5], [1,  0,  0.5], [2,  0,  0.5],
		[-2, -1,  0.5], [-1, -1,  0.5], [0, -1,  0.5], [1, -1,  0.5], [2, -1,  0.5],
		[-2, -2,  0.5], [-1, -2,  0.5], [0, -2,  0.5], [1, -2,  0.5], [2, -2,  0.5],

		[-2,  2, -0.5], [-1,  2, -0.5], [0,  2, -0.5], [1,  2, -0.5], [2,  2, -0.5],		// 奥25頂点
		[-2,  1, -0.5], [-1,  1, -0.5], [0,  1, -0.5], [1,  1, -0.5], [2,  1, -0.5],
		[-2,  0, -0.5], [-1,  0, -0.5], [0,  0, -0.5], [1,  0, -0.5], [2,  0, -0.5],
		[-2, -1, -0.5], [-1, -1, -0.5], [0, -1, -0.5], [1, -1, -0.5], [2, -1, -0.5],
		[-2, -2, -0.5], [-1, -2, -0.5], [0, -2, -0.5], [1, -2, -0.5], [2, -2, -0.5]
	];

	var pos = [];

	// 引数で受け取ったインデックスの順番通りに頂点座標を並び換える
	for(var i=0; i<index.length; i++){		// ポリゴン数
		for(var k=0; k<3; k++){				// 3頂点
			for(var m=0; m<3; m++){			// xyz

				var a = index[i][k];
				pos.push( position[a][m] );
			}
		}
	}
	
	return pos;
}



// 未使用
// 一時インデックス配列を、使える形に変形する
/*
function transIndex_old(indexF, indexS){

	var index = [];

	// 表面のインデックスをそのままコピー
	for(var i=0; i<indexF.length; i++){

		index.push(indexF[i]);
	}

	// 裏面のインデックスを計算
	for(var i=0; i<indexF.length/3; i++){

		index.push( indexF[i*3] + 25 );
		index.push( indexF[i*3+2] + 25 );
		index.push( indexF[i*3+1] + 25 );
	}

	// 側面のインデックスを計算
	for(var i=0; i<indexS.length/2; i++){

		index.push( indexS[i*2] );
		index.push( indexS[i*2] + 25 );
		index.push( indexS[i*2+1] );

		index.push( indexS[i*2+1] );
		index.push( indexS[i*2] + 25 );
		index.push( indexS[i*2+1] + 25 );
	}

	return index;
}
*/



// 一時インデックス配列を、使える形に変形する
// 古い関数からの変更点 : indexを扱う形が一次配列から二次配列に変わった
function transIndex(indexF, indexS, shift){

	var index = [];

	// 表面のインデックスをそのままコピー
	for(var i=0; i<indexF.length; i++){

		index[i] = [];

		for(var k=0; k<3; k++){
			index[i][k] = indexF[i][k];
		}
	}

	// 裏面のインデックスを計算
	for(var i=0; i<indexF.length; i++){

		var tmp = indexF.length + i;

		index[tmp] = [];

		index[tmp][0] = indexF[i][0] + shift;
		index[tmp][1] = indexF[i][2] + shift;
		index[tmp][2] = indexF[i][1] + shift;
	}

	// 側面のインデックスを計算
	for(var i=0; i<indexS.length; i++){

		var tmp = indexF.length*2 + i*2;

		index[tmp] = [];
		index[tmp+1] = [];

		index[tmp][0] = indexS[i][0];
		index[tmp][1] = indexS[i][0] + shift;
		index[tmp][2] = indexS[i][1];

		index[tmp+1][0] = indexS[i][1];
		index[tmp+1][1] = indexS[i][0] + shift;
		index[tmp+1][2] = indexS[i][1] + shift;
	}

	return index;
}



// 文字モデル【G】頂点配列を返す
function getPosition_charG(){

	// 表面の一時インデックス
	var indexF = [
		[ 1,  6,  5], [ 1,  2,  6], [ 2,  7,  6], [ 2,  3,  7], [ 3,  8,  7],
		[ 3,  9,  8], [ 5,  6, 10], [ 6, 11, 10], [10, 11, 15], [11, 16, 15],
		[12, 13, 18], [13, 14, 18], [14, 19, 18], [15, 16, 21], [16, 17, 21],
		[17, 22, 21], [17, 18, 22], [18, 23, 22], [18, 19, 23]
	];

	// 側面の一時インデックス
	var indexS = [
		[ 1,  2], [ 2,  3], [ 3,  9], [ 9,  8], [ 8,  7],
		[ 7,  6], [ 6, 11], [11, 16], [16, 17], [17, 18],
		[18, 12], [12, 13], [13, 14], [14, 19], [19, 23],
		[23, 22], [22, 21], [21, 15], [15, 10], [10,  5], [5, 1]
	];

	// 一時インデックスを変形させて、頂点配列生成用インデックスを作成
	var index = transIndex(indexF, indexS, 25);

	// 頂点配列を生成
	var position = getCharPosFromIndex(index);

	return position;
}



// 文字モデル【A】頂点配列を返す
function getPosition_charA(){

	// 表面の一時インデックス
	var indexF = [
		[ 2,  7,  6], [ 2,  8,  7], [ 6, 11, 10], [ 6,  7, 11], [ 7,  8, 13],
		[ 8, 14, 13], [10, 11, 15], [11, 16, 15], [11, 12, 16], [12, 17, 16],
		[12, 13, 17], [13, 18, 17], [13, 14, 18], [14, 19, 18], [15, 16, 20],
		[16, 21, 20], [18, 19, 23], [19, 24, 23]
	];

	// 側面の一時インデックス
	var indexS = [
		[ 2,  8], [ 8, 14], [14, 19], [19, 24], [24, 23],
		[23, 18], [18, 17], [17, 16], [16, 21], [21, 20],
		[20, 15], [15, 10], [10,  6], [ 6,  2], [ 7, 11],
		[11, 12], [12, 13], [13,  7]
	];

	// 一時インデックスを変形させて、頂点配列生成用インデックスを作成
	var index = transIndex(indexF, indexS, 25);

	// 頂点配列を生成
	var position = getCharPosFromIndex(index);

	return position;
}



// 文字モデル【M】頂点配列を返す
function getPosition_charM(){

	// 表面の一時インデックス
	var indexF = [
		[ 0,  6,  5], [ 4,  9,  8], [ 5,  6, 10], [ 6, 11, 10], [ 6, 12, 11],
		[ 8, 13, 12], [ 8,  9, 13], [ 9, 14, 13], [10, 11, 15], [11, 16, 15],
		[11, 12, 17], [12, 13, 17], [13, 14, 18], [14, 19, 18], [15, 16, 20],
		[16, 21, 20], [18, 19, 23], [19, 24, 23]
	];

	// 側面の一時インデックス
	var indexS = [
		[ 0,  6], [ 6, 12], [12,  8], [ 8,  4], [ 4,  9],
		[ 9, 14], [14, 19], [19, 24], [24, 23], [23, 18],
		[18, 13], [13, 17], [17, 11], [11, 16], [16, 21],
		[21, 20], [20, 15], [15, 10], [10,  5], [ 5,  0]
	];

	// 一時インデックスを変形させて、頂点配列生成用インデックスを作成
	var index = transIndex(indexF, indexS, 25);

	// 頂点配列を生成
	var position = getCharPosFromIndex(index);

	return position;
}



// 文字モデル【E】頂点配列を返す
function getPosition_charE(){

	// 表面の一時インデックス
	var indexF = [
		[ 0,  1,  5], [ 1,  6,  5], [ 1,  2,  6], [ 2,  3,  8], [ 3,  9,  8],
		[ 5,  6, 10], [ 6, 11, 10], [ 7, 12, 11], [ 7, 13, 12], [10, 11, 15],
		[11, 16, 15], [11, 12, 17], [12, 13, 17], [15, 16, 20], [16, 21, 20],
		[16, 22, 21], [18, 23, 22], [18, 19, 23]
	];

	// 側面の一時インデックス
	var indexS = [
		[ 0,  1], [ 1,  2], [ 2,  3], [ 3,  9], [ 9,  8],
		[ 8,  2], [ 2,  6], [ 6, 11], [11,  7], [ 7, 13],
		[13, 17], [17, 11], [11, 16], [16, 22], [22, 18],
		[18, 19], [19, 23], [23, 22], [22, 21], [21, 20],
		[20, 15], [15, 10], [10,  5], [ 5,  0]
	];

	// 一時インデックスを変形させて、頂点配列生成用インデックスを作成
	var index = transIndex(indexF, indexS, 25);

	// 頂点配列を生成
	var position = getCharPosFromIndex(index);

	return position;
}



// 文字モデル【O】頂点配列を返す
function getPosition_charO(){

	// 表面の一時インデックス
	var indexF = [
		[ 1,  6,  5], [ 1,  2,  6], [ 2,  7,  6], [ 2,  3,  7], [ 3,  8,  7],
		[ 3,  9,  8], [ 5,  6, 10], [ 6, 11, 10], [ 8,  9, 13], [ 9, 14, 13],
		[10, 11, 15], [11, 16, 15], [13, 14, 18], [14, 19, 18], [15, 16, 21],
		[16, 17, 21], [17, 22, 21], [17, 18, 22], [18, 23, 22], [18, 19, 23]
	];

	// 側面の一時インデックス
	var indexS = [
		[ 1,  2], [ 2,  3], [ 3,  9], [ 9, 14], [14, 19],
		[19, 23], [23, 22], [22, 21], [21, 15], [15, 10],
		[10,  5], [ 5,  1], [ 6, 11], [11, 16], [16, 17],
		[17, 18], [18, 13], [13,  8], [ 8,  7], [ 7,  6]
	];

	// 一時インデックスを変形させて、頂点配列生成用インデックスを作成
	var index = transIndex(indexF, indexS, 25);

	// 頂点配列を生成
	var position = getCharPosFromIndex(index);

	return position;
}



// 文字モデル【V】頂点配列を返す
function getPosition_charV(){

	// 表面の一時インデックス
	var indexF = [
		[ 0,  1,  5], [ 1,  6,  5], [ 3,  4,  8], [ 4,  9,  8], [ 5,  6, 10],
		[ 6, 11, 10], [ 8,  9, 13], [ 9, 14, 13], [10, 11, 16], [11, 17, 16],
		[13, 18, 17], [13, 14, 18], [16, 17, 22], [17, 18, 22]
	];

	// 側面の一時インデックス
	var indexS = [
		[ 0,  1], [ 1,  6], [ 6, 11], [11, 17], [17, 13],
		[13,  8], [ 8,  3], [ 3,  4], [ 4,  9], [ 9, 14],
		[14, 18], [18, 22], [22, 16], [16, 10], [10,  5], [5, 0]
	];

	// 一時インデックスを変形させて、頂点配列生成用インデックスを作成
	var index = transIndex(indexF, indexS, 25);

	// 頂点配列を生成
	var position = getCharPosFromIndex(index);

	return position;
}



// 文字モデル【R】頂点配列を返す
function getPosition_charR(){

	// 表面の一時インデックス
	var indexF = [
		[ 0,  1,  5], [ 1,  6,  5], [ 1,  2,  6], [ 2,  7,  6], [ 2,  3,  7],
		[ 3,  8,  7], [ 3,  9,  8], [ 5,  6, 10], [ 6, 11, 10], [ 8,  9, 13],
		[ 9, 14, 13], [10, 11, 15], [11, 16, 15], [11, 12, 16], [12, 17, 16],
		[12, 13, 17], [13, 18, 17], [13, 14, 18], [15, 16, 20], [16, 21, 20],
		[17, 18, 23], [18, 24, 23]
	];

	// 側面の一時インデックス
	var indexS = [
		[ 0,  1], [ 1,  2], [ 2,  3], [ 3,  9], [ 9, 14],
		[14, 18], [18, 24], [24, 23], [23, 17], [17, 16],
		[16, 21], [21, 20], [20, 15], [15, 10], [10,  5],
		[ 5,  0], [ 6, 11], [11, 12], [12, 13], [13,  8],
		[ 8,  7], [ 7,  6]
	];

	// 一時インデックスを変形させて、頂点配列生成用インデックスを作成
	var index = transIndex(indexF, indexS, 25);

	// 頂点配列を生成
	var position = getCharPosFromIndex(index);

	return position;
}



// 文字モデル【P】頂点配列を返す
function getPosition_charP(){

	// 表面の一時インデックス
	var indexF = [
		[ 0,  1,  5], [ 1,  6,  5], [ 1,  2,  6], [ 2,  7,  6], [ 2,  3,  7],
		[ 3,  8,  7], [ 3,  9,  8], [ 5,  6, 10], [ 6, 11, 10], [ 8,  9, 13],
		[ 9, 14, 13], [10, 11, 15], [11, 16, 15], [11, 12, 16], [12, 17, 16],
		[12, 13, 17], [13, 18, 17], [13, 14, 18], [15, 16, 20], [16, 21, 20]
	];

	// 側面の一時インデックス
	var indexS = [
		[ 0,  1], [ 1,  2], [ 2,  3], [ 3,  9], [ 9, 14],
		[14, 18], [18, 17], [17, 16], [16, 21], [21, 20],
		[20, 15], [15, 10], [10,  5], [ 5,  0], [ 6, 11],
		[11, 12], [12, 13], [13,  8], [ 8,  7], [ 7,  6]
	];

	// 一時インデックスを変形させて、頂点配列生成用インデックスを作成
	var index = transIndex(indexF, indexS, 25);

	// 頂点配列を生成
	var position = getCharPosFromIndex(index);

	return position;
}



// 文字モデル【S】頂点配列を返す
function getPosition_charS(){

	// 表面の一時インデックス
	var indexF = [
		[ 1,  6,  5], [ 1,  2,  6], [ 2,  7,  6], [ 2,  3,  7], [ 3,  8,  7],
		[ 3,  9,  8], [ 5,  6, 11], [ 6,  7, 11], [ 7, 12, 11], [ 7, 13, 12],
		[ 8,  9, 14], [10, 16, 15], [11, 12, 17], [12, 13, 17], [13, 18, 17],
		[13, 19, 18], [15, 16, 21], [16, 17, 21], [17, 22, 21], [17, 18, 22],
		[18, 23, 22], [18, 19, 23]
	];

	// 側面の一時インデックス
	var indexS = [
		[ 1,  2], [ 2,  3], [ 3,  9], [ 9, 14], [14,  8],
		[ 8,  7], [ 7, 13], [13, 19], [19, 23], [23, 22],
		[22, 21], [21, 15], [15, 10], [10, 16], [16, 17],
		[17, 11], [11,  5], [ 5,  1]
	];

	// 一時インデックスを変形させて、頂点配列生成用インデックスを作成
	var index = transIndex(indexF, indexS, 25);

	// 頂点配列を生成
	var position = getCharPosFromIndex(index);

	return position;
}



// 文字モデル【N】頂点配列を返す
function getPosition_charN(){

	// 表面の一時インデックス
	var indexF = [
		[ 0,  1,  5], [ 1,  6,  5], [ 1,  7,  6], [ 3,  4,  8], [ 4,  9,  8],
		[ 5,  6, 10], [ 6, 11, 10], [ 6,  7, 11], [ 7, 12, 11], [ 7, 13, 12],
		[ 8,  9, 13], [ 9, 14, 13], [10, 11, 15], [11, 16, 15], [11, 12, 17],
		[12, 13, 17], [13, 18, 17], [13, 14, 18], [14, 19, 18], [15, 16, 20],
		[16, 21, 20], [17, 18, 23], [18, 19, 23], [19, 24, 23]
	];

	// 側面の一時インデックス
	var indexS = [
		[ 0,  1], [ 1,  7], [ 7, 13], [13,  8], [ 8,  3],
		[ 3,  4], [ 4,  9], [ 9, 14], [14, 19], [19, 24],
		[24, 23], [23, 17], [17, 11], [11, 16], [16, 21],
		[21, 20], [20, 15], [15, 10], [10,  5], [ 5,  0]
	];

	// 一時インデックスを変形させて、頂点配列生成用インデックスを作成
	var index = transIndex(indexF, indexS, 25);

	// 頂点配列を生成
	var position = getCharPosFromIndex(index);

	return position;
}



// 文字モデル【T】頂点配列を返す
function getPosition_charT(){

	// 表面の一時インデックス
	var indexF = [
		[ 0,  1,  5], [ 1,  6,  5], [ 1,  2,  6], [ 2,  7,  6], [ 2,  3,  7],
		[ 3,  8,  7], [ 3,  4,  8], [ 4,  9,  8], [ 5,  6, 10], [ 6,  7, 11],
		[ 7, 12, 11], [ 7,  8, 12], [ 8, 13, 12], [ 8,  9, 14], [11, 12, 16],
		[12, 17, 16], [12, 13, 17], [13, 18, 17], [16, 17, 21], [17, 22, 21],
		[17, 18, 22], [18, 23, 22]
	];

	// 側面の一時インデックス
	var indexS = [
		[ 0,  1], [ 1,  2], [ 2,  3], [ 3,  4], [ 4,  9],
		[ 9, 14], [14,  8], [ 8, 13], [13, 18], [18, 23],
		[23, 22], [22, 21], [21, 16], [16, 11], [11,  6],
		[ 6, 10], [10,  5], [ 5,  0]
	];

	// 一時インデックスを変形させて、頂点配列生成用インデックスを作成
	var index = transIndex(indexF, indexS, 25);

	// 頂点配列を生成
	var position = getCharPosFromIndex(index);

	return position;
}



// 枠モデルの頂点配列を返す
function getPosition_frame(width, height){		// 引数 : 枠内側のサイズ

	if(width<=0 || height<=1){
		return -1;
	}

	//----------------------------------------------------------------
	// 座標を生成 (手前 +Z 方向のみ)
	//----------------------------------------------------------------
	var tmpPos = [];
	var save = 0;		// 添え字用

	var topLeftX = -2 * (width/2+1);	// 枠左上端の頂点の座標
	var topLeftY = 2 * (height/2+1);


	// 上から2行分の座標を生成 (手前側のみ)
	for(var i=0; i<2; i++){
		for(var k=0; k<width+3; k++){

			var a = i * (width+3) + k;

			tmpPos[a] = [];

			tmpPos[a][0] = topLeftX + k*2;	// x
			tmpPos[a][1] = topLeftY - i*2;	// y
			tmpPos[a][2] = 1;				// z
		}
	}


	save += (width+3)*2;


	// 左から2列分の座標を生成 (手前側のみ) (上下と被る頂点は除く)
	for(var i=0; i<height-1; i++){
		for(var k=0; k<2; k++){

			var a = save + i*2+k;

			tmpPos[a] = [];

			tmpPos[a][0] = topLeftX + k*2;
			tmpPos[a][1] = topLeftY - 4 - i*2;
			tmpPos[a][2] = 1;
		}
	}


	save += (height-1)*2;


	// 右から2列分の座標を生成 (手前側のみ) (上下と被る頂点は除く)
	for(var i=0; i<height-1; i++){
		for(var k=0; k<2; k++){

			var a = save + i*2+k;

			tmpPos[a] = [];

			tmpPos[a][0] = topLeftX + (width+1)*2 + k*2;
			tmpPos[a][1] = topLeftY - 4 - i*2;
			tmpPos[a][2] = 1;
		}
	}


	save += (height-1)*2;


	// 下から2行分の座標を生成 (手前側のみ)
	for(var i=0; i<2; i++){
		for(var k=0; k<width+3; k++){

			var a = save + i*(width+3)+k;

			tmpPos[a] = [];

			tmpPos[a][0] = topLeftX + k*2;
			tmpPos[a][1] = topLeftY - (height+1)*2 - i*2;
			tmpPos[a][2] = 1;
		}
	}


	//----------------------------------------------------------------
	// 表面インデックスを生成
	//----------------------------------------------------------------
	var indexF = [];


	// 上枠のインデックス
	for(var i=0; i<width+2; i++){

		indexF[i*2] = [];
		indexF[i*2+1] = [];

		indexF[i*2][0] = i;				// 左上頂点 ┌─┐
		indexF[i*2][1] = i+1;			// 右上頂点 │／
		indexF[i*2][2] = i+width+3;		// 左下頂点 └

		indexF[i*2+1][0] = i+1;			// 右上頂点     ┐
		indexF[i*2+1][1] = i+width+4;	// 右下頂点   ／│
		indexF[i*2+1][2] = i+width+3;	// 左下頂点 └─┘
	}


	save = (width+2)*2;
	var save2 = (width+3)*2 - 2;	// 各辺の基準


	// 左辺のインデックス
	for(var i=0; i<height; i++){

		var a = save + i*2;
		var b = save2 + i*2;	// 各ポリゴンの基準 (2枚1セット)

		indexF[a] = [];
		indexF[a+1] = [];

		if(i == 0){											// 一番上のポリゴン
			indexF[a][0] = width+3;		// 左上頂点 ┌─┐
			indexF[a][1] = width+4;		// 右上頂点 │／
			indexF[a][2] = b+2;			// 左下頂点 └

			indexF[a+1][0] = width+4;	// 右上頂点     ┐
			indexF[a+1][1] = b+3;		// 右下頂点   ／│
			indexF[a+1][2] = b+2;		// 左下頂点 └─┘
		}else if(i == height-1){							// 一番下のポリゴン
			indexF[a][0] = b;
			indexF[a][1] = b+1;
			indexF[a][2] = b+(height-1)*2 + 2;

			indexF[a+1][0] = b+1;
			indexF[a+1][1] = b+(height-1)*2 + 3;
			indexF[a+1][2] = b+(height-1)*2 + 2;
		}else{												// その他のポリゴン
			indexF[a][0] = b;
			indexF[a][1] = b+1;
			indexF[a][2] = b+2;

			indexF[a+1][0] = b+1;
			indexF[a+1][1] = b+3;
			indexF[a+1][2] = b+2;
		}
	}


	save += height*2;
	save2 += (height-1)*2;


	// 右辺のインデックス
	for(var i=0; i<height; i++){

		var a = save + i*2;
		var b = save2 + i*2;

		indexF[a] = [];
		indexF[a+1] = [];

		if(i == 0){													// 一番上のポリゴン
			indexF[a][0] = (width+3)*2 - 2;		// 左上頂点 ┌─┐
			indexF[a][1] = (width+3)*2 - 1;		// 右上頂点 │／
			indexF[a][2] = b+2;					// 左下頂点 └

			indexF[a+1][0] = (width+3)*2 - 1;	// 右上頂点     ┐
			indexF[a+1][1] = b+3;				// 右下頂点   ／│
			indexF[a+1][2] = b+2;				// 左下頂点 └─┘
		}else if(i == height-1){									// 一番下のポリゴン
			indexF[a][0] = b;
			indexF[a][1] = b+1;
			indexF[a][2] = b+width+3;

			indexF[a+1][0] = b+1;
			indexF[a+1][1] = b+width+4;
			indexF[a+1][2] = b+width+3;
		}else{														// その他のポリゴン
			indexF[a][0] = b;
			indexF[a][1] = b+1;
			indexF[a][2] = b+2;

			indexF[a+1][0] = b+1;
			indexF[a+1][1] = b+3;
			indexF[a+1][2] = b+2;
		}
	}


	save += height*2;
	save2 += (height-1)*2 + 2;


	// 下辺のインデックス
	for(var i=0; i<width+2; i++){

		var a = save + i*2;
		var b = save2 + i;

		indexF[a] = [];
		indexF[a+1] = [];

		indexF[a][0] = b;			// 左上頂点 ┌─┐
		indexF[a][1] = b+1;			// 右上頂点 │／
		indexF[a][2] = b+width+3;	// 左下頂点 └

		indexF[a+1][0] = b+1;		// 右上頂点     ┐
		indexF[a+1][1] = b+width+4;	// 右下頂点   ／│
		indexF[a+1][2] = b+width+3;	// 左下頂点 └─┘
	}


	//----------------------------------------------------------------
	// 側面インデックスを生成
	//----------------------------------------------------------------
	var indexS = [];

	// 上辺 - 外側
	for(var i=0; i<width+2; i++){

		indexS[i] = [];

		indexS[i][0] = i;
		indexS[i][1] = i+1;
	}

	save = width+2;			// 添え字用
	save2 = (width+3)*2;	// インデックスの基準

	// 左辺 - 外側
	for(var i=0; i<height-2; i++){

		var a = save + i;
		var b = save2 + i*2;

		indexS[a] = [];

		indexS[a][0] = b+2;
		indexS[a][1] = b;
	}

	save += height-2;
	save2 += (height-1)*2 + 1;

	// 右辺 - 外側
	for(var i=0; i<height-2; i++){

		var a = save + i;
		var b = save2 + i*2;

		indexS[a] = [];

		indexS[a][0] = b;
		indexS[a][1] = b+2;
	}

	save += height-2;
	save2 += (height-2)*2 + width + 4;

	// 下辺 - 外側
	for(var i=0; i<width+2; i++){

		var a = save + i;
		var b = save2 + i;

		indexS[a] = [];

		indexS[a][0] = b+1;
		indexS[a][1] = b;
	}

	save += width+2;
	save2 = width+4;

	// 上辺 - 内側
	for(var i=0; i<width; i++){

		var a = save + i;
		var b = save2 + i;

		indexS[a] = [];

		indexS[a][0] = b+1;
		indexS[a][1] = b;
	}

	save += width;
	save2 += width+3;

	// 左辺 - 内側
	for(var i=0; i<height-2; i++){

		var a = save + i;
		var b = save2 + i*2;

		indexS[a] = [];

		indexS[a][0] = b;
		indexS[a][1] = b+2;
	}

	save += height-2;
	save2 += (height-2)*2 + 1;

	// 右辺 - 内側
	for(var i=0; i<height-2; i++){

		var a = save + i;
		var b = save2 + i*2;

		indexS[a] = [];

		indexS[a][0] = b+2;
		indexS[a][1] = b;
	}

	save += height-2;
	save2 += (height-2)*2 + 3;

	// 下辺 - 内側
	for(var i=0; i<width; i++){

		var a = save + i;
		var b = save2 + i;

		indexS[a] = [];

		indexS[a][0] = b;
		indexS[a][1] = b+1;
	}

	save += width;

	for(var i=0; i<12; i++){
		indexS[save + i] = [];
	}

	// その他
	indexS[save + 0][0] = width+3;							// 左上の方
	indexS[save + 0][1] = 0;
	indexS[save + 1][0] = (width+3)*2;
	indexS[save + 1][1] = width+3;
	indexS[save + 2][0] = width+4;
	indexS[save + 2][1] = (width+3)*2 + 1;

	indexS[save + 3][0] = width+2;							// 右上の方
	indexS[save + 3][1] = (width+3)*2 - 1;
	indexS[save + 4][0] = (width+3)*2 - 1;
	indexS[save + 4][1] = (width+3)*2 + (height-1)*2 + 1;
	indexS[save + 5][0] = (width+3)*2 + (height-1)*2;
	indexS[save + 5][1] = (width+3)*2 - 2;

	indexS[save + 6][0] = (width+3)*2 + (height-1)*4;		// 左下の方
	indexS[save + 6][1] = (width+3)*2 + (height-2)*2;
	indexS[save + 7][0] = (width+3)*3 + (height-1)*4;
	indexS[save + 7][1] = (width+3)*2 + (height-1)*4;
	indexS[save + 8][0] = (width+3)*2 + (height-2)*2 + 1;
	indexS[save + 8][1] = (width+3)*2 + (height-1)*4 + 1;

	indexS[save + 9][0] = (width+3)*2 + (height-1)*4 - 1;	// 右下の方
	indexS[save + 9][1] = (width+3)*3 + (height-1)*4 - 1;
	indexS[save + 10][0] = (width+3)*3 + (height-1)*4 - 1;
	indexS[save + 10][1] = (width+3)*4 + (height-1)*4 - 1;
	indexS[save + 11][0] = (width+3)*3 + (height-1)*4 - 2;
	indexS[save + 11][1] = (width+3)*2 + (height-1)*4 - 2;


	//----------------------------------------------------------------
	// インデックスを変換
	//----------------------------------------------------------------
	var sft = (width+3)*4 + (height-1)*4;	// 片面の頂点の合計数 (これを足すとその頂点の真後ろのインデックスが得られる)
	var index = transIndex(indexF, indexS, sft);


	//----------------------------------------------------------------
	// インデックスから座標に変換
	//----------------------------------------------------------------
	var position = [];

	for(var i=0; i<index.length; i++){
		for(var k=0; k<3; k++){
			
			var c = i*9 + k*3;

			if(index[i][k] >= sft){		// 裏面
				position[c + 0] =  tmpPos[ index[i][k]-sft ][0];	// X,Y は表面と同じ座標
				position[c + 1] =  tmpPos[ index[i][k]-sft ][1];
				position[c + 2] = -tmpPos[ index[i][k]-sft ][2];	// Z だけマイナスにする
			}else{
				position[c + 0] = tmpPos[ index[i][k] ][0];
				position[c + 1] = tmpPos[ index[i][k] ][1];
				position[c + 2] = tmpPos[ index[i][k] ][2];
			}	
		}
	}

	return position;
}