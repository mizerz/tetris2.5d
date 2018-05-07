//----------------------------------------------------------------
// テトリミノ Class
// 4つのブロックをまとめて管理
// 落下・移動・回転などの処理
//----------------------------------------------------------------



// テトリミノ
function Tetrimino(){

	this.type = 999;					// 形

	this.direction = 0;					// 向き

	this.basePos = [0, 0];				// 基準座標				basePos[2]
	
	this.blockPos = new Array(4);		// 各ブロックの座標		blockPos[4][2]
	

	for(var i=0; i<4; i++){
		this.blockPos[i] = [0, 0];
	}



	this.setRandomType = function(num){

		if(num == 999){
			this.type = Math.floor(Math.random() * 7);
		}else{
			this.type = num;
		}
	};

	

	this.ghostPos = new Array(4);		// ゴーストブロック座標		ghostPos[4][2]

	for(var i=0; i<4; i++){
		this.ghostPos[i] = [0, 0];
	}

	
	
	this.setPos = function(x, y){
		this.basePos[0] = x;
		this.basePos[1] = y;

		for(var i=0; i<4; i++){
			this.blockPos[i][0] = x + d_blockPos[this.type][this.direction][i][0];
			this.blockPos[i][1] = y + d_blockPos[this.type][this.direction][i][1];
		}
	};



	// 落下
	// 戻り値:  0 成功  -1 落下できない
	this.down = function(){

		for(var i=0; i<4; i++){
			
			if(this.checkField(this.blockPos[i][0], this.blockPos[i][1]-1)){
				return -1;
			}
		}

		this.basePos[1]--;
		this.setPos(this.basePos[0], this.basePos[1]);
		
		return 0;
	};



	// 横移動
	// 引数:  1 右  -1 左
	// 戻り値:  0 成功  -1 移動できない
	this.moveSide = function(sign){

		for(var i=0; i<4; i++){
			
			if(this.checkField(this.blockPos[i][0]+sign, this.blockPos[i][1])){
				return -1;
			}
		}

		this.basePos[0] += sign;
		this.setPos(this.basePos[0], this.basePos[1]);

		return 0;
	};



	// 回転 (時計回りのみ)
	// 戻り値:  0 成功  -1 回転できない
	this.rotation = function(){

		for(var i=0; i<4; i++){
			var tmpX = this.basePos[0] + d_blockPos[this.type][(this.direction+1)%4][i][0];
			var tmpY = this.basePos[1] + d_blockPos[this.type][(this.direction+1)%4][i][1];

			if(this.checkField(tmpX, tmpY)){
				return -1;
			}
		}

		this.direction = (this.direction+1)%4;

		for(var i=0; i<4; i++){
			this.setPos(this.basePos[0], this.basePos[1]);
		}

		return 0;
	};



	// 当たり判定
	this.checkField = function(x, y){

		// Field外にはみ出していないか
		if(x<0 || 9<x || y<0 || 22<y){
			return -1;
		}

		// そこに既にブロックはないか
		if(field[y][x] != -1){
			return -1;
		}
		
		return 0;
	};
	


	// ゴーストブロックの位置を計算
	this.updateGhost = function(){

		var tmpBaseY = this.basePos[1];
		var tmpPos = new Array(4);

		for(var i=0; i<4; i++){
			tmpPos[i] = new Array(2);

			tmpPos[i][0] = this.blockPos[i][0];
			tmpPos[i][1] = this.blockPos[i][1];
		}

		var flag = true;
		tmpBaseY = 20;
		
		do{						// 衝突するまで下がって
			tmpBaseY--;

			for(var i=0; i<4; i++){
				tmpPos[i][1] = tmpBaseY + d_blockPos[this.type][this.direction][i][1];
			}

			for(var i=0; i<4; i++){

				if(this.checkField(tmpPos[i][0], tmpPos[i][1])){
					flag = false;
				}
			}
		}while(flag);

		tmpBaseY++;				// その一つ上の座標を設定

		for(var i=0; i<4; i++){
			this.ghostPos[i][0] = this.basePos[0] + d_blockPos[this.type][this.direction][i][0];
			this.ghostPos[i][1] = tmpBaseY + d_blockPos[this.type][this.direction][i][1];
		}
	};


	
}



// テトリミノを構成する4つのブロックの座標 (相対座標)
var d_blockPos = [										// [7種のテトリミノ][4方向][4つのブロック][xy]
	[	[ [0, 0], [-1,  0], [1,  0], [2, 0] ],			//棒	//向き	0 (時計回り)
		[ [0, 0], [ 0, -1], [0,  1], [0, 2] ],					//		1
		[ [0, 0], [-1,  0], [1,  0], [2, 0] ],					//		2
		[ [0, 0], [ 0, -1], [0,  1], [0, 2] ] ],				//		3

	[	[ [0, 0], [0, 1], [1, 1], [1, 0] ],				//四角
		[ [0, 0], [0, 1], [1, 1], [1, 0] ],
		[ [0, 0], [0, 1], [1, 1], [1, 0] ],
		[ [0, 0], [0, 1], [1, 1], [1, 0] ] ],

	[	[ [0, 0], [-1, 0], [ 0, 1], [ 1, 1] ],			//S字
		[ [0, 0], [ 0, 1], [-1, 1], [-1, 2] ],
		[ [0, 0], [-1, 0], [ 0, 1], [ 1, 1] ],
		[ [0, 0], [ 0, 1], [-1, 1], [-1, 2] ] ],

	[	[ [ 0, 0], [-1, 1], [0, 1], [1, 0] ],			//Z字
		[ [-1, 0], [-1, 1], [0, 1], [0, 2] ],
		[ [ 0, 0], [-1, 1], [0, 1], [1, 0] ],
		[ [-1, 0], [-1, 1], [0, 1], [0, 2] ] ],

	[	[ [0, 0], [-1,  0], [-1,  1], [1,  0] ],		//J字
		[ [0, 0], [ 0, -1], [ 0,  1], [1,  1] ],
		[ [0, 0], [-1,  0], [ 1,  0], [1, -1] ],
		[ [0, 0], [-1, -1], [ 0, -1], [0,  1] ] ],

	[	[ [0, 0], [-1,  0], [ 1,  0], [1,  1] ],		//L字
		[ [0, 0], [ 0,  1], [ 0, -1], [1, -1] ],
		[ [0, 0], [-1, -1], [-1,  0], [1,  0] ],
		[ [0, 0], [-1,  1], [ 0,  1], [0, -1] ] ],

	[	[ [0, 0], [-1, 0], [0,  1], [1,  0] ],			//T字
		[ [0, 0], [ 0, 1], [0, -1], [1,  0] ],
		[ [0, 0], [-1, 0], [0, -1], [1,  0] ],
		[ [0, 0], [-1, 0], [0,  1], [0, -1] ] ]
];