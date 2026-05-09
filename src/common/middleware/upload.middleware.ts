import multer from "multer";

class UploadMilleware {
	public upload: multer.Multer;
	public constructor(fileSizeLimit: number) {
		this.upload = multer({
			storage: multer.memoryStorage(),
			limits: {
				fileSize: fileSizeLimit,
				fieldNameSize: 100,
			},
		});
	}
}

export { UploadMilleware };
