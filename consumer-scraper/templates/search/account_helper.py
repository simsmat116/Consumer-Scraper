import uuid
import hashlib

def check_account_post(request):
    """Validate the POST request for accounts."""
    # Check if valid json
    invalid_json = not request.is_json
    content = request.get_json()
    # Check for both username and password
    missing_info = 'username' not in content or 'password' not in content
    return invalid_json or missing_info


def set_password(password):
    """Hash the password to be stored in the database."""
    algorithm = 'sha512'
    salt = uuid.uuid4().hex
    hash_obj = hashlib.new(algorithm)
    password_salted = salt + password
    # Calculating hash of salted password
    hash_obj.update(password_salted.encode('utf-8'))
    password_hash = hash_obj.hexdigest()
    password_db_string = "$".join([algorithm, salt, password_hash])
    return password_db_string

def verify_password(password, db_password):
    """Verify the password against the hash that is stored in db."""
    # Two $ in the password stored in db
    first_index = db_password.index('$')
    second_index = db_password.index('$', first_index + 1)
    algorithm = db_password[:first_index]
    # Getting salt from the db password
    salt = db_password[first_index+1:second_index]
    # Getting hash of salted correct password
    hash_password = db_password[second_index+1:]
    hash_obj = hashlib.new(algorithm)
    password_salted = salt + password
    # Calculating has of salted entered password
    hash_obj.update(password_salted.encode('utf-8'))

    # Determining if hash of salted password is same as db one
    if hash_obj.hexdigest() == hash_password:
        return True

    return False
