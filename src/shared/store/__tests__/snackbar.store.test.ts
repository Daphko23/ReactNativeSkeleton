import {useSnackbarStore} from '../snackbar.store';

describe('SnackbarStore', () => {
  beforeEach(() => {
    useSnackbarStore.setState({
      visible: false,
      message: '',
      type: 'info',
    });
  });

  it('should show snackbar with message and default type', () => {
    useSnackbarStore.getState().show('test.message');

    const state = useSnackbarStore.getState();
    expect(state.visible).toBe(true);
    expect(state.message).toBe('test.message');
    expect(state.type).toBe('info');
  });

  it('should show snackbar with custom type', () => {
    useSnackbarStore.getState().show('error.message', 'error');

    const state = useSnackbarStore.getState();
    expect(state.visible).toBe(true);
    expect(state.message).toBe('error.message');
    expect(state.type).toBe('error');
  });

  it('should hide the snackbar', () => {
    useSnackbarStore.setState({
      visible: true,
      message: 'should disappear',
      type: 'success',
    });

    useSnackbarStore.getState().hide();

    const state = useSnackbarStore.getState();
    expect(state.visible).toBe(false);
    expect(state.message).toBe('');
    expect(state.type).toBe('info');
  });
});
