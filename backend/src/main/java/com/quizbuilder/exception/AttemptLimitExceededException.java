package com.quizbuilder.exception;

public class AttemptLimitExceededException extends RuntimeException {
    public AttemptLimitExceededException(String message) {
        super(message);
    }
}
