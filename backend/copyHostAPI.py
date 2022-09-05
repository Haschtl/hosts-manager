
from multiprocessing import Process
import wx
import threading
import wx.adv
import shutil
from flask import Flask, jsonify, request, abort, current_app as app
import ctypes
import os

PORT = 1312
APP_ID = '09f3d96e-084d-4222-b887-a9467b95a794_ep9b4jvrgjdcm'
HOSTS_PATH = 'C://windows/system32/drivers/etc/hosts'

ip_white_list = ['127.0.0.1', 'localhost', '0.0.0.0']

TRAY_TOOLTIP = 'System Tray Demo'
TRAY_ICON = 'icon.png'


def isAdmin():
    try:
        is_admin = os.getuid() == 0  # type: ignore
    except AttributeError:
        is_admin = ctypes.windll.shell32.IsUserAnAdmin() != 0
    return is_admin


def create_menu_item(menu, label, func):
    item = wx.MenuItem(menu, -1, label)
    menu.Bind(wx.EVT_MENU, func, id=item.GetId())
    menu.Append(item)
    return item


class AdAway(wx.adv.TaskBarIcon):
    def __init__(self, frame):
        self.frame = frame
        super(AdAway, self).__init__()
        self.set_icon(TRAY_ICON)
        self.Bind(wx.adv.EVT_TASKBAR_LEFT_DOWN, self.on_left_down)

    # def run_server(self):
    #     self.server.run(debug=True, port=PORT, ssl_context=(
    #         'certificate.pem', 'key.pem'), use_reloader=False)

    def CreatePopupMenu(self):
        menu = wx.Menu()
        create_menu_item(menu, 'Open App', self.open_app)
        menu.AppendSeparator()
        create_menu_item(menu, 'Exit', self.on_exit)
        return menu

    def set_icon(self, path):
        icon = wx.Icon(path)
        self.SetIcon(icon, TRAY_TOOLTIP)

    def on_left_down(self, event):
        print('Tray icon was left-clicked.')

    def on_exit(self, event):
        wx.CallAfter(self.Destroy)
        # self.s_thread.terminate()
        self.shutdown_server()
        self.frame.Close()

    def open_app(self, event):
        os.system(
            f'start shell:AppsFolder\\{APP_ID}!App')

    def shutdown_server(self):
        func = request.environ.get('werkzeug.server.shutdown')
        if func is None:
            raise RuntimeError('Not running with the Werkzeug Server')
        func()


class App(wx.App):
    def OnInit(self):
        frame = wx.Frame(None)
        self.SetTopWindow(frame)
        AdAway(frame)
        return True

server = Flask(__name__)
with server.app_context():
    @ app.before_request
    def block_method():
        ip = request.environ.get('REMOTE_ADDR')
        if ip not in ip_white_list:
            abort(403)

    @ app.route('/get', methods=['GET'])
    def get_hosts():
        path = request.args.get('path')
        if (path is not None):
            if not os.path.exists(os.path.dirname(path)):
                return jsonify({'ok': False, 'error': 'Target folder does not exist'})
            try:
                r = shutil.copy2(HOSTS_PATH, path)
                return jsonify({'ok': True, 'path': r})
            except Exception:
                return jsonify({'ok': False, 'error': 'Error while copying file'})

        else:
            return jsonify({'ok': False, 'error': 'No path specified'})

    @ app.route('/set', methods=['GET'])
    def set_hosts():
        path = request.args.get('path')
        if (path is not None):
            if not os.path.exists(os.path.dirname(path)):
                return jsonify({'ok': False, 'error': 'Target folder does not exist'})
            try:
                r = shutil.copy2(path, HOSTS_PATH)
                return jsonify({'ok': True, 'path': r})
            except Exception:
                return jsonify({'ok': False, 'error': 'Error while copying file'})
        else:
            return jsonify({'ok': False, 'error': 'No path specified'})

if __name__ == '__main__':
    trayicon = App(False)

    # ssl_context='adhoc',
    def run_server():
        server.run(debug=True, port=PORT, ssl_context=(
                'certificate.pem', 'key.pem'), use_reloader=False)

    if not isAdmin():
        s_thread = threading.Thread(target=run_server)
        s_thread.start()
        trayicon.MainLoop()
    else:
        ctypes.windll.user32.MessageBoxW(
            0, u"Please run the AdAway-Backend with Administrator privileges.", u"Error",  0)
