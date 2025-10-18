-- ====================================================================================================
create table 	STD_WORD (
		REV_NO				VARCHAR(30)					null
	,	WORD_NM				VARCHAR(200)			not	null
	,	WORD_DESC			VARCHAR(4000)				null
	,	WORD_EN_ABRV_NM		VARCHAR(200)			not	null
	,	WORD_EN_NM			VARCHAR(200)				null
	,	FORM_WORD_YN		VARCHAR(1)					null
	,	DOMN_CLASS_NM		VARCHAR(200)				null
	,	ALIAS_WORD_LIST		VARCHAR(200)				null
	,	FORBD_WORD_LIST		VARCHAR(200)				null
	,	STD_KIND			VARCHAR(40)					null
	,	STD_YN				VARCHAR(1)					null
	,	ATT_YN				VARCHAR(1)					null
	,	NTT_YN				VARCHAR(1)					null
	,	USE_YN				VARCHAR(1)					null default 'Y'::character varying
	,	constraint STD_WORD_PKEY						primary key (WORD_NM, WORD_EN_ABRV_NM)
);
comment on table	STD_WORD						is '표준단어테이블';
comment on column	STD_WORD.REV_NO					is '제정차수';
comment on column	STD_WORD.WORD_NM				is '단어명';
comment on column	STD_WORD.WORD_DESC				is '단어설명';
comment on column	STD_WORD.WORD_EN_ABRV_NM		is '단어영문약어명';
comment on column	STD_WORD.WORD_EN_NM				is '단어영문명';
comment on column	STD_WORD.FORM_WORD_YN			is '형식단어여부';
comment on column	STD_WORD.DOMN_CLASS_NM			is '도메인분류명';
comment on column	STD_WORD.ALIAS_WORD_LIST		is '이음동의어목록';
comment on column	STD_WORD.FORBD_WORD_LIST		is '금칙어목록';
comment on column	STD_WORD.STD_KIND				is '표준구분';
comment on column	STD_WORD.USE_YN					is '사용여부';

-- ====================================================================================================
-- 표준용어

create table 	STD_TERM (
		REV_NO				VARCHAR(30)					null
	,	TERM_NM				VARCHAR(200)			not	null
	,	TERM_DESC			VARCHAR(4000)				null
	,	TERM_EN_ABRV_NM		VARCHAR(200)			not	null
	,	TERM_EN_NM			VARCHAR(200)				null
	,	DOMN_NM				VARCHAR(200)			not	null
	,	ALLOWED_VALUE		VARCHAR(500)				null
	,	STD_CD_NM			VARCHAR(200)				null
	,	MNG_DEPT_NM			VARCHAR(200)				null
	,	WORK_FLD			VARCHAR(40)					null
	,	STD_KIND			VARCHAR(40)					null
	,	data_type			varchar(50)					null
	,	data_len			int4						null
	,	data_scale			int4						null
	,	std_yn				varchar(1)					null
	,	public_yn			varchar(1)					null
	,	private_yn			varchar(1)					null
	,	encode_yn			varchar(1)					null
	,	encode_method		varchar(50)					null
	,	USE_YN				VARCHAR(1)					null default 'Y'::character varying
	,	constraint STD_TERM_PKEY 						primary key (TERM_NM)
);
comment on table	STD_TERM						is '표준용어테이블';
comment on column	STD_TERM.REV_NO					is '제정차수';
comment on column	STD_TERM.TERM_NM				is '용어명';
comment on column	STD_TERM.TERM_DESC				is '용어설명';
comment on column	STD_TERM.TERM_EN_ABRV_NM		is '용어영문약어명';
comment on column	STD_TERM.TERM_EN_NM				is '용어영문명';
comment on column	STD_TERM.DOMN_NM				is '도메인명';
comment on column	STD_TERM.ALLOWED_VALUE			is '허용값';
comment on column	STD_TERM.STD_CD_NM				is '표준코드명';
comment on column	STD_TERM.MNG_DEPT_NM			is '관리부서명';
comment on column	STD_TERM.WORK_FLD				is '업무분야';
comment on column	STD_TERM.STD_KIND				is '표준구분';
comment on column	STD_TERM.USE_YN					is '사용여부';

-- ====================================================================================================
-- 표준도메인

create table 	STD_DOMAIN (
		REV_NO				VARCHAR(30)					null
	,	DOMN_GROUP_NM		VARCHAR(200)			not	null
	,	DOMN_CLASS_NM		VARCHAR(200)			not	null
	,	DOMN_NM				VARCHAR(200)			not	null
	,	DOMN_DESC			VARCHAR(4000)				null
	,	DATA_TYPE			VARCHAR(20)				not	null
	,	DATA_LEN			VARCHAR(10)					null
	,	DATA_SCALE			VARCHAR(10)					null
	,	SAVE_FMT			VARCHAR(100)				null
	,	DISP_FMT			VARCHAR(100)				null
	,	UNIT				VARCHAR(20)					null
	,	ALLOWED_VALUE		VARCHAR(300)				null
	,	STD_KIND			VARCHAR(40)					null
	,	private_yn			varchar(1)					null
	,	private_gubun		varchar(50)					null
	,	encode_yn			varchar(1)					null
	,	encode_method		varchar(50)					null
	,	USE_YN				VARCHAR(1)					null default 'Y'::character varying
	,	constraint STD_DOMAIN_PKEY 						primary key (DOMN_GROUP_NM, DOMN_NM)
);
comment on table	STD_DOMAIN						is '표준도메인테이블';
comment on column	STD_DOMAIN.REV_NO				is '제정차수';
comment on column	STD_DOMAIN.DOMN_GROUP_NM		is '도메인그룹명';
comment on column	STD_DOMAIN.DOMN_CLASS_NM		is '도메인분류명';
comment on column	STD_DOMAIN.DOMN_NM				is '도메인명';
comment on column	STD_DOMAIN.DOMN_DESC			is '도메인설명';
comment on column	STD_DOMAIN.DATA_TYPE			is '데이터타입';
comment on column	STD_DOMAIN.DATA_LEN				is '데이터길이';
comment on column	STD_DOMAIN.DATA_SCALE			is '데이터소수점길이';
comment on column	STD_DOMAIN.SAVE_FMT				is '저장형식';
comment on column	STD_DOMAIN.DISP_FMT				is '표현형식';
comment on column	STD_DOMAIN.UNIT					is '단위';
comment on column	STD_DOMAIN.ALLOWED_VALUE		is '허용값';
comment on column	STD_DOMAIN.STD_KIND				is '표준구분';
comment on column	STD_DOMAIN.USE_YN				is '사용여부';

-- ====================================================================================================

create table 	standard_info (
		INFO_TYPE			VARCHAR(3)				not	null	-- 'STD|TBL|COL'
	,	TBL_NM				VARCHAR(300)			not	null
	,	COL_NM				VARCHAR(300)			not	null
	,	PRIVATE_YN			VARCHAR(1)					null
	,	ENCRYPT_YN			VARCHAR(1)					null
	,	PUBLIC_YN			VARCHAR(1)					null
	,	STD_YN				VARCHAR(1)					null
	,	USE_YN				VARCHAR(1)				not	null
	,	constraint standard_info_PKEY 					primary key (INFO_TYPE, TBL_NM, COL_NM)
);
comment on table	standard_info						is '표준정보테이블';
comment on column	standard_info.INFO_TYPE				is '정보유형';
comment on column	standard_info.TBL_NM				is '테이블명';
comment on column	standard_info.COL_NM				is '컬럼명';
comment on column	standard_info.PRIVATE_YN			is '개인정보여부';
comment on column	standard_info.ENCRYPT_YN			is '암호화여부';
comment on column	standard_info.PUBLIC_YN				is '공개여부';
comment on column	standard_info.STD_YN				is '표준여부';
comment on column	standard_info.USE_YN				is '사용여부';

insert into standard_info (INFO_TYPE, TBL_NM, COL_NM, STD_YN, USE_YN) values ('STD', 'TB_%',	'',	'Y', 'Y');

