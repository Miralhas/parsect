from pydantic_settings import BaseSettings, SettingsConfigDict

class CustomBaseSettings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )


class Config(CustomBaseSettings):
    STALKERS_URL: str
    ROBOT_HEADER: str
    ROBOT_SECRET: str


settings = Config()