
import shutil
from flask import Flask, jsonify, request, abort, current_app as app
import ctypes
import os

PORT = 1312


def isAdmin():
    try:
        is_admin = os.getuid() == 0  # type: ignore
    except AttributeError:
        is_admin = ctypes.windll.shell32.IsUserAnAdmin() != 0
    return is_admin


app = Flask(__name__)
hosts_path = 'C://windows/system32/drivers/etc/hosts'


ip_white_list = ['127.0.0.1', 'localhost', '0.0.0.0']


@app.before_request
def block_method():
    ip = request.environ.get('REMOTE_ADDR')
    if ip not in ip_white_list:
        abort(403)


@app.route('/get', methods=['GET'])
def get_hosts():
    path = request.args.get('path')
    if (path is not None):
        if not os.path.exists(os.path.dirname(path)):
            return jsonify({'ok': False, 'error': 'Target folder does not exist'})
        try:
            r = shutil.copy2(hosts_path, path)
            return jsonify({'ok': True, 'path': r})
        except Exception:
            return jsonify({'ok': False, 'error': 'Error while copying file'})

    else:
        return jsonify({'ok': False, 'error': 'No path specified'})


@app.route('/set', methods=['GET'])
def set_hosts():
    path = request.args.get('path')
    if (path is not None):
        if not os.path.exists(os.path.dirname(path)):
            return jsonify({'ok': False, 'error': 'Target folder does not exist'})
        try:
            r = shutil.copy2(path, hosts_path)
            return jsonify({'ok': True, 'path': r})
        except Exception:
            return jsonify({'ok': False, 'error': 'Error while copying file'})
    else:
        return jsonify({'ok': False, 'error': 'No path specified'})


if __name__ == '__main__':
    if isAdmin():
        app.run(debug=True, port=PORT, ssl_context='adhoc')
    else:
        input("Please rerun this script as admin")
