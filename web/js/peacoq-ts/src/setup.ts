import * as Coq85 from "./coq85";
import * as Coqtop85 from "./coqtop85";
// import * as Coqtop from "./coqtop-rx";
// import * as CoqtopInput from "./coqtop-input";
import { PeaCoqContext, PeaCoqHyp } from "./coqtop85";
// import * as EditStage from "./edit-stage";
import { allEditorTabs, EditorTab } from "./editor-tab";
import { Feedback } from "./feedback";
// import * as FeedbackContent from "./feedback-content";
import { GoalNode } from "./goalnode";
import { Goals } from "./goals";
// import { setupKeybindings } from "./keybindings";
import { Message } from "./message";
import { Warning } from "./message-level";
import { ProofTree, proofTrees } from "./prooftree";
import { getActiveProofTree } from "./prooftree-utils";
import { Status } from "./status";
import { Tab } from "./tab";
import { Tactic } from "./tactic";
import { TacticGroupNode } from "./tacticgroupnode";
// import { setupTheme, theme } from "./theme";
// // TODO: toolbar.ts should setup{Load,Save}File upon setupToolbar
// // TODO: unless it can't because of keybindings?
// import { pickFile, saveFile, setupLoadFile, setupToolbar, setupSaveFile } from "./toolbar";

let fontSize = 16; // pixels
let resizeBufferingTime = 250; // milliseconds

let layout: W2UI.W2Layout;
let rightLayout: W2UI.W2Layout;
let contextTabs: W2UI.W2Tabs;
let coqtopTabs: W2UI.W2Tabs;

$(document).ready(() => {

  let style = "";// "border: 1px solid #dfdfdf;";

  // $("#interface").w2layout({
  //   name: "layout",
  //   panels: [
  //     { type: "top", size: 34, resizable: false, style: style, content: $("<div>", { id: "toolbar" }) },
  //     { type: "left", size: "50%", overflow: "hidden", resizable: true, style: style, content: $("<div>", { id: "editor", style: "height: 100%" }) },
  //     { type: "main", size: "50%", style: style, overflow: "hidden", content: $("<div>", { id: "right" }) },
  //     { type: "bottom", hidden: true, size: "30%", overflow: "hidden", resizable: true, style: style, content: $("<div>", { id: "prooftree" }) },
  //   ]
  // });
  //
  // let editor = ace.edit("editor");
  // editor.selection.on("changeCursor", (e) => {
  //   let cursorPosition = editor.selection.getCursor();
  //   _(coqDocument.getEditStagesProcessed()).each((stage) => {
  //     if (stage.edit.containsPosition(cursorPosition)) {
  //       updateCoqtopTabs(stage.goals, stage.context);
  //     }
  //   });
  // });
  //
  // //editor.selection.on("changeSelection", (e) => { console.log(e); });
  // coqDocument = new Coq85.CoqDocument(editor);
  //
  // let editAtBecauseEditorChange: Rx.Observable<CoqtopInput.CoqtopInput> =
  //   coqDocument.changeStream.flatMap((change) => {
  //     console.log("should remove edits after", Coq85.minPos(change.start, change.end));
  //     return [];
  //   });
  //
  // Coq85.setupEditor(editor);
  // editor.focus();
  //
  // $().w2layout({
  //   name: "right-layout",
  //   panels: [
  //     { type: "main", size: "50%", resizable: true, style: style, tabs: { tabs: [], } },
  //     { type: "bottom", size: "50%", resizable: true, style: style, tabs: { tabs: [], } },
  //   ],
  // });
  //
  // layout = w2ui["layout"];
  // rightLayout = w2ui["right-layout"];
  // contextTabs = w2ui["right-layout_main_tabs"];
  // contextTabs.onClick = function(event) {
  //   $("#myTabsContent").html(event.target);
  // };
  // coqtopTabs = w2ui["right-layout_bottom_tabs"];
  //
  // rightLayout.on({ type: "render", execute: "after" }, () => {
  //
  //   // top panes
  //   pretty = new Tab("pretty", "Pretty", "right-layout", "main");
  //   pretty.div.css("padding-left", "4px");
  //   foreground = new EditorTab("foreground", "Foreground", "right-layout", "main");
  //   background = new EditorTab("background", "Background", "right-layout", "main");
  //   shelved = new EditorTab("shelved", "Shelved", "right-layout", "main");
  //   givenUp = new EditorTab("givenup", "Given up", "right-layout", "main");
  //   contextTabs.click("pretty");
  //
  //   // bottom panes
  //   notices = new EditorTab("notices", "Notices", "right-layout", "bottom");
  //   warnings = new EditorTab("warnings", "Warnings", "right-layout", "bottom");
  //   errors = new EditorTab("errors", "Errors", "right-layout", "bottom");
  //   infos = new EditorTab("infos", "Infos", "right-layout", "bottom");
  //   debug = new EditorTab("debug", "Debug", "right-layout", "bottom");
  //   failures = new EditorTab("failures", "Failures", "right-layout", "bottom");
  //   jobs = new EditorTab("jobs", "Jobs", "right-layout", "bottom");
  //   feedback = new EditorTab("feedback", "Feedback", "right-layout", "bottom");
  //   coqtopTabs.click("notices");
  //
  //   // TODO: stream this
  //   updateFontSize(coqDocument);
  // })
  //
  // layout.content("main", rightLayout);
  //
  // let windowResizeStream: Rx.Observable<{}> = Rx.Observable.fromEvent($(window), "resize");
  // let layoutResizeStream = setupW2LayoutResizeStream(layout);
  // let rightLayoutResizeStream = setupW2LayoutResizeStream(rightLayout);
  // Rx.Observable.merge(windowResizeStream, layoutResizeStream, rightLayoutResizeStream)
  //   // only fire once every <resizeBufferingTime> milliseconds
  //   .bufferWithTime(resizeBufferingTime).filter((a) => !_.isEmpty(a))
  //   .subscribe(onResize)
  //   ;
  //
  // // TODO: figure out if this was needed
  // //layout.on({ type: "hide", execute: "after" }, () => { coqDocument.recenterEditor(); });
  // //layout.on({ type: "show", execute: "after" }, () => { coqDocument.recenterEditor(); });
  //
  // let toolbarStreams = setupToolbar();
  // let shortcutsStreams = setupKeybindings();
  //
  // Coq85.setupSyntaxHovering();
  // setupTheme();
  //
  // let loadedFilesStream = setupLoadFile();
  // setupSaveFile();
  //
  // let fontDecreasedStream =
  //   Rx.Observable
  //     .merge(toolbarStreams.fontDecrease, shortcutsStreams.fontDecrease)
  //     .do(() => { fontSize--; });
  // let fontIncreasedStream =
  //   Rx.Observable
  //     .merge(toolbarStreams.fontIncrease, shortcutsStreams.fontIncrease)
  //     .do(() => { fontSize++; });
  // Rx.Observable
  //   .merge(fontIncreasedStream, fontDecreasedStream)
  //   .subscribe(() => { updateFontSize(coqDocument); });
  //
  // Rx.Observable
  //   .merge(toolbarStreams.goToCaret, shortcutsStreams.goToCaret)
  //   .subscribe(() => console.log("TODO: go to caret"));
  //
  // let nextStream = Rx.Observable
  //   .merge(toolbarStreams.next, shortcutsStreams.next);
  // let editsToProcessStream = Coq85.onNextReactive(coqDocument, nextStream);
  // //editsToProcessStream.subscribe((e) => coqDocument.pushEdit(e));
  // //editsToProcessStream.subscribe((e) => coqDocument.moveCursorToPositionAndCenter(e.getStopPosition()));
  // let addsToProcessStream = Coq85.processEditsReactive(editsToProcessStream);
  //
  // Rx.Observable
  //   .merge(toolbarStreams.previous, shortcutsStreams.previous)
  //   .subscribe(() => console.log("TODO: previous"));
  //
  // Rx.Observable
  //   .merge(toolbarStreams.load, shortcutsStreams.load)
  //   .subscribe(pickFile);
  // Rx.Observable
  //   .merge(toolbarStreams.save, shortcutsStreams.save)
  //   .subscribe(saveFile);
  //
  // let coqtopOutputStreams = Coqtop.setupCoqtopCommunication([
  //   // reset Coqtop when a file is loaded
  //   loadedFilesStream.map(() => new CoqtopInput.EditAt(1)),
  //   addsToProcessStream,
  // ]);
  //
  // coqtopOutputStreams.goodResponse
  //   // keep only responses for adds produced by PeaCoq
  //   .filter((r) => {
  //     let i = r.input;
  //     return i instanceof CoqtopInput.AddPrime && i.hasEdit();
  //   })
  //   .subscribe((r) => {
  //     let stateId = r.contents[0];
  //     (<CoqtopInput.AddPrime>r.input).edit.caseOf({
  //       nothing: () => { throw "nothing" },
  //       just: (edit) => {
  //         let stage = edit.stage;
  //         if (stage instanceof EditStage.ToProcess) {
  //           edit.stage = new EditStage.BeingProcessed(stage, stateId);
  //         } else {
  //           throw "Expected edit in EditStageToProcess stage";
  //         }
  //       },
  //     });
  //   });
  //
  // // Logging feedbacks that I haven't figured out what to do with yet
  // subscribeAndLog(
  //   coqtopOutputStreams.feedback
  //     .filter((f) => !(f.feedbackContent instanceof FeedbackContent.FileDependency || f.feedbackContent instanceof FeedbackContent.FileLoaded))
  //     .filter((f) => !(f.feedbackContent instanceof FeedbackContent.AddedAxiom))
  //     .filter((f) => !(f.feedbackContent instanceof FeedbackContent.Processed && f.editOrState === "state"))
  //     .filter((f) => !(f.feedbackContent instanceof FeedbackContent.ProcessingIn && f.editOrState === "state"))
  //     .filter((f) => !(f.feedbackContent instanceof FeedbackContent.ErrorMsg))
  // );
  //
  // coqtopOutputStreams.feedback
  //   .filter((f) => f.editOrState === "state")
  //   .filter((f) => f.feedbackContent instanceof FeedbackContent.Processed)
  //   .distinctUntilChanged()
  //   .subscribe((f) => {
  //     let stateId = f.editOrStateId;
  //     let editStageReady = _(coqDocument.getEditStagesBeingProcessed())
  //       .find((stage) => stage.stateId === stateId);
  //     if (editStageReady) {
  //       editStageReady.edit.stage = new EditStage.Processed(editStageReady);
  //       if (coqDocument.getEditStagesToProcess().length === 0) {
  //         coqDocument.moveCursorToPositionAndCenter(editStageReady.getStopPosition());
  //       }
  //     }
  //   });
  //
  // coqtopOutputStreams.feedback
  //   .filter((f) => f.feedbackContent instanceof FeedbackContent.ErrorMsg)
  //   .distinctUntilChanged()
  //   .subscribe((f) => {
  //     let e = <FeedbackContent.ErrorMsg><any>f.feedbackContent;
  //     assert(f.editOrState === "state", "Expected ErrorMsg to carry a state, not an edit");
  //     let failedStateId = f.editOrStateId;
  //     let failedEditStage = _(coqDocument.getEditStagesBeingProcessed()).find((s) => s.stateId === failedStateId);
  //     if (failedEditStage) {
  //       let failedEdit = failedEditStage.edit;
  //       coqDocument.removeEditsAfter(failedEdit);
  //       errors.setValue(e.message, true);
  //       let errorStart = coqDocument.movePositionRight(failedEdit.getStartPosition(), e.start);
  //       let errorStop = coqDocument.movePositionRight(failedEdit.getStartPosition(), e.stop);
  //       let errorRange = new AceAjax.Range(errorStart.row, errorStart.column, errorStop.row, errorStop.column);
  //       coqDocument.markError(errorRange);
  //     }
  //   });

  // peaCoqAddHandlers.push(proofTreeOnAdd);
  // peaCoqGetContextHandlers.push(proofTreeOnGetContext);
  // peaCoqEditAtHandlers.push(proofTreeOnEditAt);
  // peaCoqEditAtHandlers.push(editorOnEditAt);
  // peaCoqGoalHandlers.push(proofTreeOnGoal);
  // peaCoqStatusHandlers.push(proofTreeOnStatus);
  // editHandlers.push(proofTreeOnEdit);
});

let lastStatus: Status;

// function editorOnEditAt(sid: number) {
//   let edit = _(coqDocument.editsProcessed).find((e) => e.stateId === sid);
//   if (edit) {
//     killEditsAfterPosition(coqDocument, edit.getStopPosition());
//     updateCoqtopTabs(edit.goals, edit.context);
//   }
// }

function proofTreeOnStatus(s) {
  lastStatus = s;
}

function updateCoqtopTabs(goals: Goals, context: PeaCoqContext) {
  console.log("TODO: updateCoqtopTabs");
  // clearCoqtopTabs(false);
  // if (context.length > 0) {
  //   pretty.div.append(context[0].getHTML());
  //   foreground.setValue(goals.fgGoals[0].toString(), false);
  // }
}

function proofTreeOnEdit(
  query: string,
  stateId: number,
  lastStatus: Status,
  status: Status,
  goals: Goals,
  context: PeaCoqContext
): void {

  let trimmed = CoqStringUtils.coqTrim(query);

  updateCoqtopTabs(goals, context);

  if (
    lastStatus.statusAllProofs.length + 1 === status.statusAllProofs.length
    &&
    proofTrees.length + 1 === status.statusAllProofs.length
  ) {
    // we are behind on the number of proof trees, create one
    showProofTreePanel()
      .then(() => { // needs to be before for width/height
        let pt = new ProofTree(
          status.statusProofName,
          $("#prooftree")[0],
          $("#prooftree").parent().width(),
          $("#prooftree").parent().height()
        );
        proofTrees.unshift(pt);
        assert(context.length === 1, "proofTreeOnGetContext: c.length === 1, c.length: " + context.length);
        let g = new GoalNode(pt, nothing(), goals, context[0]);
        assert(pt.rootNode !== undefined, "proofTreeOnGetContext: new GoalNode should set rootNode");
        g.stateIds.push(stateId);
        pt.curNode = g;
        pt.update();
      });
    return;
  } else {
    // multiple trees might have been finished at once?
    while (proofTrees.length > status.statusAllProofs.length) {
      proofTrees.shift();
      if (proofTrees.length === 0) {
        $("#prooftree").empty();
        hideProofTreePanel();
      }
    }
  }

  if (proofTrees.length === 0) { return; }

  let activeProofTree = proofTrees[0];
  let curNode = activeProofTree.curNode;

  if (isUpperCase(trimmed[0]) || CoqStringUtils.isBullet(trimmed)) {
    curNode.goals = goals;
    curNode.stateIds.push(stateId);
    return;
  }

  let tactic: Tactic = _.find(curNode.getTactics(), (t) => t.tactic === trimmed);

  let tacticGroup: TacticGroupNode = (
    tactic
      ? tactic.parentGroup
      : new TacticGroupNode(activeProofTree, curNode, "")
  );

  /*
  We need to figure out which foreground goals are relevant to this tactic node.
  If the number of unfocused goals has changed by running the tactic, the tactic
  must have solved the previous goal and the current foreground goals are the
  remaining ones.
  Otherwise, the delta foreground goals have been created by running the tactic.
  */
  let goalsBefore = curNode.goals;
  let goalsAfter = goals;
  let nbRelevantGoals =
    goalsBefore.bgGoals.length === goalsAfter.bgGoals.length
      ? goalsAfter.fgGoals.length - (goalsBefore.fgGoals.length - 1)
      : 0;
  let relevantGoals = context.slice(0, nbRelevantGoals);

  let goalNodes: GoalNode[] =
    _(relevantGoals).map(function(goal) {
      return new GoalNode(
        activeProofTree,
        just(tacticGroup),
        goals,
        goal
      );
    }).value();

  if (!tactic) {
    curNode.tacticGroups.push(tacticGroup);
    tactic = new Tactic(trimmed, tacticGroup, goalNodes);
    tacticGroup.tactics.push(tactic);
  } else {
    tactic.goals = goalNodes;
  }

  tacticGroup.isProcessed = true;

  if (goalNodes.length > 0) {
    let curGoal: GoalNode = goalNodes[0];
    curGoal.stateIds.push(stateId);
    activeProofTree.curNode = curGoal;
    activeProofTree.update();
  } else {
    curNode.onChildSolved(stateId);
  }

}

/*
  For now, let"s just rewind within the tree or give up. Eventually,
  we could rewind into old trees.
 */
function proofTreeOnEditAt(sid: number): void {

  if (proofTrees.length === 0) { return; }
  let activeProofTree = proofTrees[0];
  //lastStateId = sid;
  let curNode = activeProofTree.curNode;

  // clean up necessary for tactics waiting
  activeProofTree.tacticWaiting = nothing();

  // first, get rid of all stored stateIds > sid
  // and mark their children tactic groups unprocessed
  let allGoals = activeProofTree.rootNode.getAllGoalDescendants();
  _(allGoals).each((g) => {
    if (_(g.stateIds).some((s) => s >= sid)) {
      _(g.tacticGroups).each((g) => { g.isProcessed = false; });
    }
    g.stateIds = _(g.stateIds).filter((s) => s <= sid).value();
  });
  let target = _(allGoals).find((g) => {
    return _(g.stateIds).some((s) => s === sid);
  });
  if (target) {
    activeProofTree.curNode = target;
    activeProofTree.update();
  } else {
    proofTrees.length = 0;
    hideProofTreePanel();
    $("#prooftree").empty();
  }

}

export function onResize(): void {
  Coq85.coqDocument.editor.resize();
  getActiveProofTree().fmap((t) => {
    let parent = $("#prooftree").parent();
    t.resize(parent.width(), parent.height());
  });
}

function hideProofTreePanel(): void {
  layout.hide("bottom");
}

function showProofTreePanel(): Promise<{}> {
  return new Promise(function(onFulfilled) {
    let handler = function(event) {
      event.onComplete = onFulfilled;
      layout.off("show", handler);
    };
    layout.on("show", handler);
    layout.show("bottom");
  });
}

function updateFontSize(d: Coq85.CoqDocument): void {
  d.editor.setOption("fontSize", fontSize);
  _(allEditorTabs).each((e: EditorTab) => {
    e.setOption("fontSize", fontSize);
  });
  jss.set("#pretty-content", { "font-size": fontSize + "px" });
  jss.set("svg body", { "font-size": fontSize + "px" });
  getActiveProofTree().fmap((t) => t.update());
}

function setupW2LayoutResizeStream(layout: W2UI.W2Layout): Rx.Observable<{}> {
  return Rx.Observable
    .create((observer) => {
      layout.on({ type: "resize", execute: "after" }, () => observer.onNext({}));
    })
    .share()
    ;
}
