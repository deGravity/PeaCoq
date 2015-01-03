{-# LANGUAGE OverloadedStrings #-}

module Handlers where

import           Control.Applicative ((<$>))
import           Control.Monad.IO.Class (liftIO)
import           Data.ByteString.UTF8 (toString)
import qualified Data.IntMap as IM
import qualified Data.Text as T
import           Snap.Core
import           Snap.Extras.JSON
import           Snap.Snaplet
import           Snap.Snaplet.Session hiding (touchSession)
import           Snap.Snaplet.Session.SessionManager ()
import           System.FilePath.Find ((==?), always, extension, find)
import           System.IO
import           System.Log.Logger
import           System.Random

import           CoqTypes
import           Coqtop
import           Parser
import           PeaCoq

lecturePath :: String
lecturePath = "web/coq/"

type PeaCoqHandler = Handler PeaCoq PeaCoq ()

data HandlerInput = HandlerInput
  { inputHandle :: Handle
  , outputHandle :: Handle
  }

logAction :: String -> IO ()
logAction = infoM rootLoggerName

keyField :: T.Text
keyField = "key"

getSessionKey :: Handler PeaCoq PeaCoq IM.Key
getSessionKey = with lSession $ do
  mkey <- getFromSession keyField
  case mkey of
    Nothing -> do
      key <- liftIO randomIO
      setInSession keyField (T.pack . show $ key)
      liftIO . logAction $ "No session key found, initializing: " ++ show key
      return key
    Just key -> do
      liftIO . logAction $ "Session key found: " ++ show key
      return . read . T.unpack $ key

respond :: CoqtopResponse [String] -> HandlerInput -> PeaCoqHandler
respond response (HandlerInput hi ho) = do
  goals <- liftIO $ hQueryGoal hi ho
  writeJSON $ MkPeaCoqResponse goals response

parseHandler :: HandlerInput -> PeaCoqHandler
parseHandler _ = do
  param <- getParam "query"
  case param of
    Nothing -> return ()
    Just queryBS -> do
      let response = parseVernac $ toString queryBS
      writeJSON response

parseEvalHandler :: HandlerInput -> PeaCoqHandler
parseEvalHandler _ = do
  param <- getParam "query"
  case param of
    Nothing -> return ()
    Just queryBS -> do
      let response = parseEvalResult $ toString queryBS
      writeJSON response

parseCheckHandler :: HandlerInput -> PeaCoqHandler
parseCheckHandler _ = do
  param <- getParam "query"
  case param of
    Nothing -> return ()
    Just queryBS -> do
      let response = parseCheckResult $ toString queryBS
      writeJSON response

queryHandler :: HandlerInput -> PeaCoqHandler
queryHandler input@(HandlerInput hi ho) = do
  param <- getParam "query"
  case param of
    Nothing -> return ()
    Just queryBS -> do
      response <- liftIO $ do
        -- might want to sanitize? :3
        let query = toString queryBS
        logAction $ "Serving query:\nSTART\n" ++ query ++ "\nEND"
        hInterp hi query
        hForceValueResponse ho
      respond response input

queryUndoHandler :: HandlerInput -> PeaCoqHandler
queryUndoHandler input@(HandlerInput hi ho) = do
  param <- getParam "query"
  case param of
    Nothing -> return ()
    Just queryBS -> do
      response <- liftIO $ do
        -- might want to sanitize? :3
        let query = toString queryBS
        hInterp hi query
        hForceValueResponse ho
      respond response input
      case response of
        Fail _ ->
          return ()
        Good _ ->
          do
            liftIO $ hCall hi [("val", "rewind"), ("steps", "1")] ""
            liftIO $ hForceValueResponse ho
            return ()

undoHandler :: HandlerInput -> PeaCoqHandler
undoHandler input@(HandlerInput hi ho) = do
  r <- liftIO $ do
    hCall hi [("val", "rewind"), ("steps", "1")] ""
    hForceValueResponse ho
  respond r input

statusHandler :: HandlerInput -> PeaCoqHandler
statusHandler input@(HandlerInput hi ho) = do
  r <- liftIO $ do
    hCall hi [("val", "status")] ""
    hForceStatusResponse ho
  respond (return . show <$> r) input

rewindHandler :: HandlerInput -> PeaCoqHandler
rewindHandler input@(HandlerInput hi ho) = do
  param <- getParam "query"
  case param of
    Nothing -> return ()
    Just stepsBS -> do
      let steps = toString stepsBS
      r <- liftIO $ do
        logAction $ "Rewinding " ++ show steps ++ " steps"
        hCall hi [("val", "rewind"), ("steps", steps)] ""
        hForceValueResponse ho
      respond (return . show <$> r) input

qedHandler :: HandlerInput -> PeaCoqHandler
qedHandler input@(HandlerInput hi ho) = do
  liftIO $ hInterp hi "Qed."
  r <- liftIO $ hForceValueResponse ho
  respond r input

logHandler :: HandlerInput -> PeaCoqHandler
logHandler input = do
  param <- getParam "query"
  case param of
    Nothing -> return ()
    Just messageBS -> do
      let message = toString messageBS
      liftIO $ do
        putStrLn $ "Attempting to log: " ++ message
        noticeM rootLoggerName message
      respond (Good ["OK"]) input

listLecturesHandler :: HandlerInput -> PeaCoqHandler
listLecturesHandler input = do
  filePaths <- liftIO $ find always (extension ==? ".v") lecturePath
  -- don't want to show full path to users
  let files = map (drop (length lecturePath)) filePaths
  respond (Good files) input

loadLectureHandler :: HandlerInput -> PeaCoqHandler
loadLectureHandler input = do
  param <- getParam "query"
  case param of
    Nothing -> return ()
    Just messageBS -> do
      let fileName = toString messageBS
      contents <- liftIO $ readFile (lecturePath ++ fileName)
      respond (Good [contents]) input

{-
identifyHandler :: IORef GlobalState -> HandlerInput -> PeaCoqHandler
identifyHandler ref input = do
  param <- getParam "query"
  case param of
    Nothing -> return ()
    Just payloadBS -> do
      let userId = toString payloadBS
      mapKey <- getSessionKey
      liftIO $ do
        handler <- fileHandler ("./log/log-" ++ userId) loggingPriority
        let format = simpleLogFormatter "[$time] $msg"
        let fHandler = setFormatter handler format
        updateGlobalLogger userId $ addHandler fHandler
        atomicModifyIORef' ref $ adjustSession (touchSession . setIdentity userId) mapKey
        noticeM userId $ "IDENTIFY " ++ show mapKey ++ " -> " ++ userId
      respond (Good ["OK"]) input
-}
