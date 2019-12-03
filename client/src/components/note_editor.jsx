import React, { Component } from "react";
import axios from "axios";
import { Row, Col, Input, Card } from "antd";
import NoteEditorLayout from "./note_editor_layout";
import NoteEditorButtons from "./note_editor_buttons";
import NoteEditorTitleField from "./note_editor_title_field";
import NoteEditorDescriptionField from "./note_editor_description_field";
import NoteEditorSharing from "./note_editor_sharing_editor";
import ErrorDisplay from "./error_display";

export default class NoteEditor extends Component {
  constructor() {
    super();
    this.state = {
      note: {}
    };
  }

  componentDidMount() {
    this.fetchNote();
  }

  setLoading(loading) {
    this.setState({
      loading
    });
  }

  setErrors(errors) {
    this.setState({
      errors
    });
  }

  setNote(note) {
    this.setState({
      note
    });
  }

  setNoteTitle(title) {
    let note = Object.assign({}, this.state.note);
    note.title = title;
    this.setNote(note);
  }

  setNoteDescription(description) {
    let note = Object.assign({}, this.state.note);
    note.description = description;
    this.setNote(note);
  }

  saveClicked() {
    this.saveNote();
  }

  deleteClicked() {
    this.recycleNote();
  }

  restoreClicked() {
    this.restoreNote();
  }

  fetchNote() {
    const { id } = this.props.match.params;
    this.setLoading(true);
    axios
      .get("/notes/" + id)
      .then(response => {
        this.setLoading(false);
        this.setNote(response.data);
      })
      .catch(error => {
        this.handleErrorResponse(error);
      });
  }

  recycleNote() {
    const { id } = this.props.match.params;
    const { history } = this.props;
    this.setLoading(true);
    axios
      .post("/notes/" + id + "/recycle")
      .then(response => {
        this.setLoading(false);
        this.setNote(response.data);
        this.updateParentComponentOfChange();
        history.push("/notes");
      })
      .catch(error => {
        this.handleErrorResponse(error);
      });
  }

  restoreNote() {
    const { id } = this.props.match.params;
    const { history } = this.props;
    this.setLoading(true);
    axios
      .post("/notes/" + id + "/restore")
      .then(response => {
        this.setLoading(false);
        this.setNote(response.data);
        this.updateParentComponentOfChange();
        history.push("/notes/" + id);
      })
      .catch(error => {
        this.handleErrorResponse(error);
      });
  }

  saveNote() {
    const { id } = this.props.match.params;
    this.setLoading(true);
    axios
      .put("/notes/" + id, this.state.note)
      .then(response => {
        this.setLoading(false);
        this.setNote(response.data);
      })
      .catch(error => {
        this.handleErrorResponse(error);
      });
  }

  updateParentComponentOfChange() {
    const { noteUpdated } = this.props;
    if (noteUpdated) noteUpdated();
  }

  handleErrorResponse(error) {
    this.setLoading(false);
    const { response } = error;
    if (response && response.data && response.data.errors) {
      this.setErrors(response.data.errors);
    } else {
      this.setErrors(["Oops. Something went wrong on our end."]);
    }
  }

  render() {
    const { note, errors } = this.state;
    return (
      <NoteEditorLayout>
        <Row>
          <Col xs={22}>
            <NoteEditorTitleField
              value={note.title}
              onChange={event => this.setNoteTitle(event.target.value)}
            />
          </Col>
          <Col xs={2}>
            <ErrorDisplay errors={errors} />
            <NoteEditorSharing note={note} />
            <NoteEditorButtons
              isRecycled={note.recycled}
              saveClicked={() => this.saveClicked()}
              restoreClicked={() => this.restoreClicked()}
              deleteClicked={() => this.deleteClicked()}
            />
          </Col>
        </Row>
        <Row style={{ paddingTop: "0.3em" }}>
          <NoteEditorDescriptionField
            value={note.description}
            onChange={event => this.setNoteDescription(event.target.value)}
          />
        </Row>
      </NoteEditorLayout>
    );
  }
}
