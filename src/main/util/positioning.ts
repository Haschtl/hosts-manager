import { BrowserWindow, screen, Tray } from 'electron';

type TaskbarLocation = 'top' | 'bottom' | 'left' | 'right';

type Position =
  | 'trayLeft'
  | 'trayBottomLeft'
  | 'trayRight'
  | 'trayBottomRight'
  | 'trayCenter'
  | 'trayBottomCenter'
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight'
  | 'topCenter'
  | 'bottomCenter'
  | 'leftCenter'
  | 'rightCenter'
  | 'center';

const isLinux = process.platform === 'linux';

const trayToScreenRects = (
  tray: Tray
): [Electron.Rectangle, Electron.Rectangle] => {
  // There may be more than one screen, so we need to figure out on which screen our tray icon lives.
  const { workArea, bounds: screenBounds } = screen.getDisplayMatching(
    tray.getBounds()
  );

  workArea.x -= screenBounds.x;
  workArea.y -= screenBounds.y;

  return [screenBounds, workArea];
};

export function taskbarLocation(tray: Tray): TaskbarLocation {
  const [screenBounds, workArea] = trayToScreenRects(tray);

  // TASKBAR LEFT
  if (workArea.x > 0) {
    // Most likely Ubuntu hence assuming the window should be on top
    if (isLinux && workArea.y > 0) return 'top';
    // The workspace starts more on the right
    return 'left';
  }

  // TASKBAR TOP
  if (workArea.y > 0) {
    return 'top';
  }

  // TASKBAR RIGHT
  // Here both workArea.y and workArea.x are 0 so we can no longer leverage them.
  // We can use the workarea and display width though.
  // Determine taskbar location
  if (workArea.width < screenBounds.width) {
    // The taskbar is either on the left or right, but since the LEFT case was handled above,
    // we can be sure we're dealing with a right taskbar
    return 'right';
  }

  // TASKBAR BOTTOM
  // Since all the other cases were handled, we can be sure we're dealing with a bottom taskbar
  return 'bottom';
}

type WindowPosition =
  | 'trayCenter'
  | 'topRight'
  | 'trayBottomCenter'
  | 'bottomLeft'
  | 'bottomRight';

/**
 * Depending on where the taskbar is, determine where the window should be
 * positioned.
 *
 * @param tray - The Electron Tray instance.
 */
export function getWindowPosition(tray: Tray): WindowPosition {
  switch (process.platform) {
    // macOS
    // Supports top taskbars
    case 'darwin':
      return 'trayCenter';
    // Linux
    // Windows
    // Supports top/bottom/left/right taskbar
    case 'linux':
    case 'win32': {
      const traySide = taskbarLocation(tray);

      // Assign position for menubar
      if (traySide === 'top') {
        return isLinux ? 'topRight' : 'trayCenter';
      }
      if (traySide === 'bottom') {
        return isLinux ? 'bottomRight' : 'trayBottomCenter';
      }
      if (traySide === 'left') {
        return 'bottomLeft';
      }
      if (traySide === 'right') {
        return 'bottomRight';
      }
      break;
    }
    default:
      break;
  }

  // When we really don't know, we just show the menubar on the top-right
  return 'topRight';
}

class Positioner {
  browserWindow: BrowserWindow;

  tray: Tray | null;

  constructor(browserWindow: BrowserWindow, tray: Tray | null) {
    this.browserWindow = browserWindow;
    this.tray = tray;
    // if (this.tray) {
    //   console.log(taskbarLocation(this.tray));
    // }
  }

  getCoords(position: Position, trayPosition?: Electron.Rectangle) {
    const screenSize = this.getScreenSize(trayPosition);
    const windowSize = this.getWindowSize();

    // if (trayPosition === undefined) trayPosition = {};

    // Positions
    let positions: { [id: string]: { x: number; y: number } } = {
      topLeft: {
        x: screenSize.x,
        y: screenSize.y,
      },
      topRight: {
        x: Math.floor(screenSize.x + (screenSize.width - windowSize[0])),
        y: screenSize.y,
      },
      bottomLeft: {
        x: screenSize.x,
        y: Math.floor(screenSize.height - (windowSize[1] - screenSize.y)),
      },
      bottomRight: {
        x: Math.floor(screenSize.x + (screenSize.width - windowSize[0])),
        y: Math.floor(screenSize.height - (windowSize[1] - screenSize.y)),
      },
      topCenter: {
        x: Math.floor(
          screenSize.x + (screenSize.width / 2 - windowSize[0] / 2)
        ),
        y: screenSize.y,
      },
      bottomCenter: {
        x: Math.floor(
          screenSize.x + (screenSize.width / 2 - windowSize[0] / 2)
        ),
        y: Math.floor(screenSize.height - (windowSize[1] - screenSize.y)),
      },
      leftCenter: {
        x: screenSize.x,
        y:
          screenSize.y +
          Math.floor(screenSize.height / 2) -
          Math.floor(windowSize[1] / 2),
      },
      rightCenter: {
        x: Math.floor(screenSize.x + (screenSize.width - windowSize[0])),
        y:
          screenSize.y +
          Math.floor(screenSize.height / 2) -
          Math.floor(windowSize[1] / 2),
      },
      center: {
        x: Math.floor(
          screenSize.x + (screenSize.width / 2 - windowSize[0] / 2)
        ),
        y: Math.floor(
          (screenSize.height + screenSize.y) / 2 - windowSize[1] / 2
        ),
      },
    };
    if (trayPosition === undefined && this.tray !== null) {
      // eslint-disable-next-line no-param-reassign
      trayPosition = this.tray.getBounds();
    }
    if (trayPosition) {
      positions = {
        ...positions,
        trayLeft: {
          x: Math.floor(trayPosition.x),
          y: screenSize.y,
        },
        trayBottomLeft: {
          x: Math.floor(trayPosition.x),
          y: Math.floor(screenSize.height - (windowSize[1] - screenSize.y)),
        },
        trayRight: {
          x: Math.floor(trayPosition.x - windowSize[0] + trayPosition.width),
          y: screenSize.y,
        },
        trayBottomRight: {
          x: Math.floor(trayPosition.x - windowSize[0] + trayPosition.width),
          y: Math.floor(screenSize.height - (windowSize[1] - screenSize.y)),
        },
        trayCenter: {
          x: Math.floor(
            trayPosition.x - windowSize[0] / 2 + trayPosition.width / 2
          ),
          y: screenSize.y,
        },
        trayBottomCenter: {
          x: Math.floor(
            trayPosition.x - windowSize[0] / 2 + trayPosition.width / 2
          ),
          y: Math.floor(screenSize.height - (windowSize[1] - screenSize.y)),
        },
      };
    }

    // Default to right if the window is bigger than the space left.
    // Because on Windows the window might get out of bounds and dissappear.
    if (position.substr(0, 4) === 'tray') {
      if (
        positions[position].x + windowSize[0] >
        screenSize.width + screenSize.x
      ) {
        return {
          x: positions.topRight.x,
          y: positions[position].y,
        };
      }
    }

    return positions[position];
  }

  getWindowSize() {
    return this.browserWindow.getSize();
  }

  // eslint-disable-next-line class-methods-use-this
  getScreenSize(trayPosition?: Electron.Rectangle) {
    if (trayPosition) {
      return screen.getDisplayMatching(trayPosition).workArea;
    }
    return screen.getDisplayNearestPoint(screen.getCursorScreenPoint())
      .workArea;
  }

  move(position: Position, trayPos?: Electron.Rectangle) {
    // Get positions coords
    const coords = this.getCoords(position, trayPos);

    // Set the windows position
    this.browserWindow.setPosition(coords.x, coords.y);
  }

  calculate(position: Position, trayPos?: Electron.Rectangle) {
    // Get positions coords
    const coords = this.getCoords(position, trayPos);

    return {
      x: coords.x,
      y: coords.y,
    };
  }
}

export default Positioner;
