class BaseCongig(object):
    '''
    Base config class
    '''
    DEBUG = True
    TESTING = False
class ProductionConfig(BaseCongig):
    """
    Production specific config
    """
    DEBUG = False
class DevelopmentConfig(BaseCongig):
    """
    Development environment specific configuration
    """
    DEBUG = True
    TESTING = True
    MYSQL_HOST = '127.0.0.1'
    MYSQL_USER = 'root'
    MYSQL_PASSWORD = ''
    MYSQL_DB = 'consumer_scraper'
    MYSQL_PORT = '3306'
