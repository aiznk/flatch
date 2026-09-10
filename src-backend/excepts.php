<?php
namespace fc;

class FileDoesNotExistsError extends \Exception {}
class FileIOError extends \Exception {}
class FileExistsError extends \Exception {}
class ValidationError extends \Exception {}
class ParseError extends \Exception {}
class ReachedLimitError extends \Exception {}
