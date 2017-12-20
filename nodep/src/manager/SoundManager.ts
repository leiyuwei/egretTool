/**
 * 声音管理器
 * @author nodep
 * @version 1.1
 */
class SoundManager {

	private static _ins: SoundManager;
	private _nowBg: string = "";
	private _bgC: egret.SoundChannel;
	public enable: boolean = false;
	private _durTDic: Map<string, number> = new Map<string, number>();
	private _soundDic: Map<string, egret.SoundChannel> = new Map<string, egret.SoundChannel>();

	public constructor() {
	}

	public static getIns(): SoundManager {
		if (SoundManager._ins == null)
			SoundManager._ins = new SoundManager();
		return SoundManager._ins;
	}

	/**
	 * 播放背景音乐
	 * @param  {string} mp3 xxx_mp3
	 * @param  {number=0} times 播放次数,默认循环
	 */
	public playBg(mp3: string, times: number = 0): void {
		if (this._nowBg == mp3 || (!this.enable && mp3 != ""))
			return;
		this._nowBg = mp3;
		if (this._bgC) {
			TweenTs.removeTweens(this._bgC);
			try {
				this._bgC.stop();
			} catch (e) {

			}
		}
		var sd: egret.Sound = RES.getRes(mp3);
		if (!sd)
			return;
		this._bgC = sd.play(0, times);
		if (this._bgC == null)
			return;
		this._bgC.volume = 0;
		TweenTs.get(this._bgC).to({ volume: NodepConfig.bgVolume }, 3000);
	}

	/**
	 * 循环播放音效
	 * @param  {string} mp3 xxx_mp3
	 * @param  {number=1} toV
	 */
	public playSoundLoop(mp3: string, toV: number = 1): void {
		if (!this.enable || !NodepManager.getIns().isActive)
			return;
		if (this._soundDic.get(mp3) != null)
			return;
		var sd: egret.Sound = RES.getRes(mp3);
		if (!sd)
			return;
		var cc: egret.SoundChannel = sd.play(0, 0);
		if (cc == null)
			return;
		cc.volume = toV;
		this._soundDic.set(mp3, cc);
	}

	/**
	 * 停止循环音效的播放
	 * @param  {string} mp3
	 */
	public stopSoundLoop(mp3: string): void {
		if (this._soundDic.get(mp3) == null)
			return;
		var cc: egret.SoundChannel = this._soundDic.get(mp3);
		cc.stop();
		this._soundDic.delete(mp3);
	}

	/**
	 * 播放音效
	 * @param  {string} mp3 音效名称 xxx_mp3
	 * @param  {number=1} toV 音效大小
	 * @param  {number=0} durT 多长时间以内不能再次播放次音效
	 */
	public playSound(mp3: string, toV: number = 1, durT: number = 0): void {
		if (!this.enable || !NodepManager.getIns().isActive)
			return;
		if (durT > 0) {
			if (this._durTDic.get(mp3) == null)
				this._durTDic.set(mp3, 0);
			var t: number = new Date().getTime();
			if (t - this._durTDic.get(mp3) < durT)
				return;
			this._durTDic.set(mp3, t);
		}
		var sd: egret.Sound = RES.getRes(mp3);
		if (!sd)
			return;
		var cc: egret.SoundChannel = sd.play(0, 1);
		if (cc == null)
			return;
		cc.volume = toV;
	}
}