<?php
namespace fc;

require_once __dir__ .'/consts.php';
require_once __dir__ .'/excepts.php';

class RecordValidator {
	public $subject_empty;

	function validate ($name, $email, $datetime, $content, $subject) {
		if (is_null($name) || 
			mb_strlen($name) < RES_NAME_MIN_LEN ||
			mb_strlen($name) > RES_NAME_MAX_LEN ||
			preg_match(INVALID_RES_REG_EXP, $name) === 1) {
			throw new ValidationError('invalid name');
		}
		if (is_null($email) || 
			mb_strlen($email) < RES_EMAIL_MIN_LEN ||
			mb_strlen($email) > RES_EMAIL_MAX_LEN ||
			preg_match(INVALID_RES_REG_EXP, $email) === 1) {
			throw new ValidationError('invalid email');
		}
		if (is_null($datetime) ||
			mb_strlen($datetime) < RES_DATETIME_MIN_LEN ||
			mb_strlen($datetime) > RES_DATETIME_MAX_LEN ||
			preg_match(INVALID_RES_REG_EXP, $datetime) === 1) {
			throw new ValidationError('invalid datetime');
		}
		if (is_null($content) || 
			mb_strlen($content) < RES_CONTENT_MIN_LEN ||
			mb_strlen($content) > RES_CONTENT_MAX_LEN ||
			preg_match(INVALID_RES_REG_EXP, $content) === 1) {
			throw new ValidationError('invalid content');
		}
		if ($this->subject_empty) {
			if (is_null($subject) ||
		        mb_strlen($subject)) {
				throw new ValidationError('subject not empty');
			}
		} else {
			if (is_null($subject) || 
				mb_strlen($subject) < RES_SUBJECT_MIN_LEN ||
				mb_strlen($subject) > RES_SUBJECT_MAX_LEN ||
				preg_match(INVALID_RES_REG_EXP, $subject) === 1) {
				throw new ValidationError('invalid subject');
			}			
		}
	}
}