/// <reference path="block.js">



var field;

// 列挙型 シーン切り換え用
var SceneName = {
	title:		0,
	start:		1,
	down:		2,
	dell:		3,
	push:		4,
	gameover:	5,
};



function GameMain(){

	this.keyW = 0;
	this.keyA = 0;
	this.keyS = 0;
	this.keyD = 0;
	this.keyEnter = 0;

	this.scene = SceneName.title;

	this.currentBlock = new Tetrimino();
	this.nextBlock = new Tetrimino();

	this.flag_PRESSENTER = false;		// 表示・非表示、アニメーションの操作用
	this.flag_GAMESTART = false;
	this.flag_GAMEOVER = 0;
	this.flag_field = 0;
	this.flag_currentBlock = 0;
	this.flag_nextBlock = 0;
	this.flag_ghostBlock = 0;
	
	this.flag_0 = true;			// 1frameのみの命令を実行するためのflag

	this.downBlockCount = 0;	// 落下用
	this.defSpeed = 20;
	this.downSpeed = this.defSpeed;
	this.deleteLineCount = 0;	// 消した数 この数値によって落下速度が変わる

	this.saveFieldLine = new Array(20);		// そろってる列を記録する

	for(var i=0; i<20; i++){
		this.saveFieldLine[i] = 0;
	}

	// field 初期化
	field = new Array(23);
	
	for(var i=0; i<23; i++){
		field[i] = new Array(10);

		for(var j=0; j<10; j++){
			field[i][j] = -1;
		}
	}
	


	this.update = function(){
	
		switch(this.scene){
			case SceneName.title:		// PRESSENTER の文字が動くシーン


				if(this.flag_0){
					this.flag_0 = false;
					this.flag_PRESSENTER = true;		// 最初のframeでアニメーション開始
				}

				// enterキーが押されたら
				if(this.keyEnter == 1){
					this.scene = SceneName.start;
					this.flag_PRESSENTER = false;
					this.flag_0 = true;
				}
				

				break;
			case SceneName.start:		// GAMESTART の文字が動くシーン


				if(this.flag_0){
					this.flag_0 = false;
					this.flag_GAMESTART = true;		// 最初のframeでアニメーション開始
				}

				// 一定時間たってアニメーションが終了したら
				if(!this.flag_GAMESTART){
					this.flag_0 = true;
					this.init();					// 初期設定
					this.scene = SceneName.down;
				}

				
				break;
			case SceneName.down:		// 落下


				this.downBlockCount++;


				if(this.keyW == 1){
					this.currentBlock.rotation();
				}
				if(this.keyA == 1){
					this.currentBlock.moveSide(-1);
				}
				if(this.keyD == 1){
					this.currentBlock.moveSide(1);
				}
				if(this.keyS >= 1){
					this.downBlockCount = this.downSpeed;
				}


				if(this.downBlockCount == this.downSpeed){
					this.downBlockCount = 0;

					// 落下処理
					if(this.currentBlock.down() == -1){		// 落下できなかった場合

						// 一列そろってるかチェック
						if(this.check() == 0){			// そろってない

							this.next();
							this.scene = SceneName.down;

						}else if(this.check() == 1){	// そろった
					
							this.scene = SceneName.dell;

						}else if(this.check() == 2){	// 上についた

							this.scene = SceneName.gameover;
						}
					}
				}

				this.currentBlock.updateGhost();


				break;
			case SceneName.dell:		// 消去アニメーション


				if(this.flag_0){
					this.flag_0 = false;
					this.flag_field = 3;
				}

				if(this.flag_field == 4){	// 消失アニメーションが終わったら実体も消す
					this.flag_0 = true;

					for(var i=0; i<20; i++){

						if(this.saveFieldLine[i] == 2){
							for(var j=0; j<10; j++){
								field[i][j] = -1;
							}
						}
					}
					this.scene = SceneName.push;
				}


				break;
			case SceneName.push:		// 落下


				var saveNum = new Array(20);
				for(var i=0; i<20; i++){
					saveNum[i] = i;
				}

				for(var i=0; i<19; i++){

					for(var j=0; j<i+1; j++){

						if(this.saveFieldLine[i-j] == 2){
							var tmp = this.saveFieldLine[i-j];
							this.saveFieldLine[i-j] = this.saveFieldLine[i-j+1];
							this.saveFieldLine[i-j+1] = tmp;

							var tmp2 = saveNum[i-j];
							saveNum[i-j] = saveNum[i-j+1];
							saveNum[i-j+1] = tmp2;
						}
					}
				}

				var tmpField = Array(20);

				for(var i=0; i<20; i++){
					tmpField[i] = [];

					for(var j=0; j<10; j++){
						tmpField[i][j] = field[ saveNum[i] ][j];
					}
				}

				for(var i=0; i<20; i++){
					for(var j=0; j<10; j++){
						field[i][j] = tmpField[i][j];
					}
				}

				this.next();
				this.scene = SceneName.down;


				break;
			case SceneName.gameover:
				

				if(this.flag_0){
					this.flag_0 = false;
					this.flag_GAMEOVER = 1;
					this.flag_field = 2;
					this.flag_nextBlock = 2;
				}

				if(this.flag_GAMEOVER == 2){
					this.flag_PRESSENTER = true;

					// enterキーが押されたら
					if(this.keyEnter == 1){
						this.flag_GAMEOVER = 0;
						this.flag_PRESSENTER = false;
						this.flag_0 = true;

						this.reset();
						this.scene = SceneName.start;
					}
				}
				

				break;
		}// switch end
	};// update end



	// ゲームの最初に1度だけ初期化処理
	this.init = function(){
		this.currentBlock.setRandomType(999);
		this.nextBlock.setRandomType(999);

		this.currentBlock.setPos(4, 20);
		this.nextBlock.setPos(13, 5);
		this.currentBlock.updateGhost();

		this.flag_field = 1;
		this.flag_currentBlock = 1;
		this.flag_nextBlock = 1;
		this.flag_ghostBlock = 1;
	};



	// そろってるかチェック
	this.check = function(){

		// field に固定
		for(var i=0; i<4; i++){
			var x = this.currentBlock.blockPos[i][0];
			var y = this.currentBlock.blockPos[i][1];
			field[y][x] = this.currentBlock.type;
		}

		// 非表示にする
		this.flag_currentBlock = 0;
		this.flag_ghostBlock = 0;

		// ゲームオーバー判定
		for(var i=0; i<10; i++){
			if(field[20][i] != -1){
				return 2;
			}
		}

		// そろった判定
		var tmp = false;

		for(var i=0; i<20; i++){
			var count = 0;

			for(var k=0; k<10; k++){
				if(field[i][k] != -1){
					count++;
				}
			}

			if(count == 10){
				this.saveFieldLine[i] = 2;		// そろってる
				tmp = true;
				this.deleteLineCount++;

				if(this.deleteLineCount%4 == 0){	// そろった列の数に応じてスピードアップ
					this.downSpeed--;
				}

			}else if(count == 0){				// 何もない
				this.saveFieldLine[i] = 0;

			}else{
				this.saveFieldLine[i] = 1;		// いくつかある
			}
		}

		if(tmp){
			return 1;
		}

		return 0;
	};
	
	

	// nextブロックに切り替えなど
	this.next = function(){
		this.currentBlock.setRandomType( this.nextBlock.type );
		this.nextBlock.setRandomType(999);
		this.currentBlock.direction = 0;
		this.currentBlock.setPos(4, 20);
		this.nextBlock.setPos(13, 5);
		this.currentBlock.updateGhost();
		this.flag_currentBlock = 1;
		this.flag_ghostBlock = 1;

		for(var i=0; i<20; i++){
			this.saveFieldLine[i] = 0;
		}
	};



	// ゲームオーバー後のリセット
	this.reset = function(){
		this.flag_field = 0;
		this.flag_currentBlock = 0;
		this.flag_nextBlock = 0;
		this.flag_ghostBlock = 0;

		this.downBlockCount = 0;
		this.downSpeed = this.defSpeed;
		this.currentBlock.direction = 0;
		this.deleteLineCount = 0;

		for(var i=0; i<23; i++){
			for(var j=0; j<10; j++){
				field[i][j] = -1;
			}
		}

		for(var i=0; i<20; i++){
			this.saveFieldLine[i] = 0;
		}
	};



	// currentBlock と nextBlock と ghostBlock それぞれの4つのブロックの座標を配列で返す
	this.getPos = function(){

		/* 配列構造

		tmp --+-- currentBlock --+-- ブロック1 --+-- x座標
			  +-- nextBlock		 +-- ブロック2	 +-- y座標
			  +-- ghostBlock	 +-- ブロック3
								 +-- ブロック4
		*/

		var tmp = new Array(3);

		for(var i=0; i<3; i++){
			tmp[i] = new Array(4);

			for(var j=0; j<4; j++){
				tmp[i][j] = new Array(2);
			}
		}

		// 4ブロックの座標を格納
		for(var i=0; i<4; i++){
			for(var j=0; j<2; j++){

				tmp[0][i][j] = this.currentBlock.blockPos[i][j];
				tmp[1][i][j] = this.nextBlock.blockPos[i][j];
				tmp[2][i][j] = this.currentBlock.ghostPos[i][j];
			}
		}

		return tmp;
	};



	// キー操作
	this.keyInput = function(w, a, s, d, enter){

		this.keyW = w;
		this.keyA = a;
		this.keyS = s;
		this.keyD = d;
		this.keyEnter = enter;
	};



}