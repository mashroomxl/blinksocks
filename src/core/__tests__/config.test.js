jest.mock('fs');

import {
  Config,
  DEFAULT_KEY,
  DEFAULT_LOG_LEVEL
} from '../config';

beforeEach(function () {
  const fs = require('fs');
  fs.lstatSync = () => {
    const err = new Error();
    err.code = 'ENOENT';
    throw err;
  };
});

describe('Config#init', function () {

  // exceptions

  it('should throw when pass non-object', function () {
    expect(() => Config.init(null)).toThrow();
    expect(() => Config.init([])).toThrow();
  });

  it('should throw when host is not provided', function () {
    expect(() => Config.init({})).toThrow();
    expect(() => Config.init({host: ''})).toThrow();
  });

  it('should throw when port is not natural number', function () {
    expect(() => Config.init({host: 'localhost', port: -1})).toThrow();
  });

  it('should throw when servers(if provided) is not an array', function () {
    expect(() => Config.init({host: 'localhost', port: 1080, servers: ''})).toThrow();
  });

  it('should throw when servers(if provided) is an array but empty', function () {
    expect(() => Config.init({host: 'localhost', port: 1080, servers: []})).toThrow();
  });

  it('should throw when servers(if provided) is an array but has invalid items', function () {
    expect(() => Config.init({host: 'localhost', port: 1080, servers: ['']})).toThrow();
  });

  it('should throw when key is not string', function () {
    expect(function () {
      Config.init({
        host: 'localhost',
        port: 1080,
        servers: ['abc.com:443'],
        key: null
      });
    }).toThrow();
  });

  it('should throw when key is empty', function () {
    expect(function () {
      Config.init({
        host: 'localhost',
        port: 1080,
        servers: ['abc.com:443'],
        key: '',
      });
    }).toThrow();
  });

  it('should throw when key is DEFAULT_KEY', function () {
    expect(function () {
      Config.init({
        host: 'localhost',
        port: 1080,
        servers: ['abc.com:443'],
        key: DEFAULT_KEY
      });
    }).toThrow();
  });

  it('should throw when frame is not string', function () {
    expect(function () {
      Config.init({
        host: 'localhost',
        port: 1080,
        servers: ['abc.com:443'],
        key: '123',
        frame: null
      });
    }).toThrow();
  });

  it('should throw when frame_params is not string', function () {
    expect(function () {
      Config.init({
        host: 'localhost',
        port: 1080,
        servers: ['abc.com:443'],
        key: '123',
        frame: 'xxx',
        frame_params: [1, 2]
      });
    }).toThrow();
  });

  it('should throw when crypto is not string', function () {
    expect(function () {
      Config.init({
        host: 'localhost',
        port: 1080,
        servers: ['abc.com:443'],
        key: '123',
        frame: 'xxx',
        frame_params: '',
        crypto: null
      });
    }).toThrow();
  });

  it('should throw when crypto_params is not string', function () {
    expect(function () {
      Config.init({
        host: 'localhost',
        port: 1080,
        servers: ['abc.com:443'],
        key: '123',
        frame: 'xxx',
        frame_params: '',
        crypto: 'xxx',
        crypto_params: [1, 2]
      });
    }).toThrow();
  });

  it('should throw when protocol is not string', function () {
    expect(function () {
      Config.init({
        host: 'localhost',
        port: 1080,
        servers: ['abc.com:443'],
        key: '123',
        frame: 'xxx',
        frame_params: '',
        crypto: 'xxx',
        crypto_params: '1,2',
        protocol: null
      });
    }).toThrow();
  });

  it('should throw when protocol_params is not string', function () {
    expect(function () {
      Config.init({
        host: 'localhost',
        port: 1080,
        servers: ['abc.com:443'],
        key: '123',
        frame: 'xxx',
        frame_params: '',
        crypto: 'xxx',
        crypto_params: '1,2',
        protocol: 'basic',
        protocol_params: [1, 2]
      });
    }).toThrow();
  });

  it('should throw when obfs is not string', function () {
    expect(function () {
      Config.init({
        host: 'localhost',
        port: 1080,
        servers: ['abc.com:443'],
        key: '123',
        frame: 'xxx',
        frame_params: '',
        crypto: 'xxx',
        crypto_params: '1,2',
        protocol: 'basic',
        protocol_params: '1,2',
        obfs: null
      });
    }).toThrow();
  });

  it('should throw when obfs_params is not string', function () {
    expect(function () {
      Config.init({
        host: 'localhost',
        port: 1080,
        servers: ['abc.com:443'],
        key: '123',
        frame: 'xxx',
        frame_params: '',
        crypto: 'xxx',
        crypto_params: '1,2',
        protocol: 'basic',
        protocol_params: '1,2',
        obfs: 'none',
        obfs_params: [1, 2]
      });
    }).toThrow();
  });

  it('should throw when redirect is invalid', function () {
    expect(function () {
      Config.init({
        host: 'localhost',
        port: 1080,
        servers: ['abc.com:443'],
        key: '123',
        frame: 'xxx',
        frame_params: '',
        crypto: 'xxx',
        crypto_params: '1,2',
        protocol: 'basic',
        protocol_params: '1,2',
        obfs: 'none',
        obfs_params: '',
        redirect: 'test.com'
      });
    }).toThrow();
  });

  // others

  it('should this._is_server set to true, if no server_host provided', function () {
    Config.init({
      host: 'localhost',
      port: 1080,
      key: '123',
      frame: 'xxx',
      frame_params: '',
      crypto: 'xxx',
      crypto_params: '1,2',
      protocol: 'basic',
      protocol_params: '1,2',
      obfs: 'none',
      obfs_params: '1,2'
    });
    expect(Config._is_server).toBe(true);
  });

});

describe('Config#setGlobals', function () {

  it('should set expected global constants', function () {
    Config.init({
      host: 'localhost',
      port: 1080,
      key: '123',
      frame: 'origin',
      frame_params: '',
      crypto: 'xxx',
      crypto_params: '1,2',
      protocol: 'basic',
      protocol_params: '1,2',
      obfs: 'none',
      obfs_params: '1,2'
    });
    expect(__IS_SERVER__).toBe(true);
    expect(__IS_CLIENT__).toBe(false);
    expect(__LOCAL_HOST__).toBe('localhost');
    expect(__LOCAL_PORT__).toBe(1080);
    expect(__KEY__).toBe('123');
    expect(__FRAME__).toBe('origin');
    expect(__FRAME_PARAMS__).toBe('');
    expect(__PROTOCOL__).toBe('basic');
    expect(__PROTOCOL_PARAMS__).toBe('1,2');
    expect(__OBFS__).toBe('none');
    expect(__OBFS_PARAMS__).toBe('1,2');
    expect(__CRYPTO__).toBe('xxx');
    expect(__CRYPTO_PARAMS__).toBe('1,2');
    expect(__LOG_LEVEL__).toBe(DEFAULT_LOG_LEVEL);
  });

});

describe('Config#setUpLogger', function () {

  it('should set log level to DEFAULT_LOG_LEVEL', function () {
    Config.setUpLogger();
    expect(Config.log_level).toBe(DEFAULT_LOG_LEVEL);
  });

  it('should set log level to silly', function () {
    Config.setUpLogger('silly');
    expect(Config.log_level).toBe('silly');
  });

});

describe('Config#abstract', function () {

  it('should return expected object', function () {
    const abstract = Config.abstract();
    expect(abstract).toMatchObject({
      host: 'localhost',
      port: 1080,
      key: '123',
      frame: 'origin',
      frame_params: '',
      crypto: 'xxx',
      crypto_params: '1,2',
      protocol: 'basic',
      protocol_params: '1,2',
      obfs: 'none',
      obfs_params: '1,2'
    });
  });

});
